import axios, { AxiosError } from 'axios';
import { BASE_URL } from 'gatsby-env-variables';
import store from 'store2';

import { emitter, emitterEvent } from '../event';
import { WalletInfo } from '../web3Store/context';

export const baseURL: string = BASE_URL;

export interface RequestBody<R> {
  code: string;
  message: string;
  status: string;
  data: R;
}

interface SignData {
  nonce: string;
  signature: string;
  address: string;
}
export interface AuthResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string[];
  token_type?: string;
  signTime?: string;
}

function genAuthorization() {
  const authInfo = store.get('authInfo') as AuthResponse;
  const Authorization =
    `${authInfo?.token_type || ''} ${authInfo?.access_token || ''}` || '';

  return Authorization;
}

export const AxiosInstance = (
  baseURL: string,
  walletInfo: WalletInfo,
  sign: () => Promise<SignData>,
  authInfo?: AuthResponse
) => {
  const Authorization =
    `${authInfo?.token_type || ''} ${authInfo?.access_token || ''}` || '';

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization
    }
  });

  axiosInstance.interceptors.response.use(
    function (response) {
      return response.data as RequestBody<{ data: string }>;
    },
    async function (error: AxiosError<RequestBody<null>>) {
      if (error.response?.status === 403) {
        await checkToken(sign, walletInfo, authInfo);

        const Authorization = genAuthorization();

        return axiosInstance.request({
          ...error.config,
          headers: {
            ...error.config.headers,
            Authorization
          }
        });
      }

      const errorMsg = error.response?.data;

      if (errorMsg) throw errorMsg;
      throw error;
    }
  );

  return axiosInstance;
};

interface CreateTokenParams {
  grant_type: 'access_token';
  user_id: string;
  verify_params: SignData;
}

interface RefreshTokenParams {
  grant_type: 'refresh_token';
  user_id: string;
  verify_params: {
    refresh_token: string;
  };
}

type GetTokenParams = CreateTokenParams | RefreshTokenParams;

interface MetaMaskError {
  code?: number;
  message: string;
}

async function checkToken(
  sign: () => Promise<SignData>,
  walletInfo: WalletInfo,
  authInfo?: AuthResponse
) {
  async function reSign() {
    const signInfo = await sign();

    await createToken({
      grant_type: 'access_token',
      user_id: `${walletInfo.address}_ethereum`,
      verify_params: signInfo
    });
  }

  try {
    const refresh_token = authInfo?.refresh_token;

    if (refresh_token) {
      await refreshToken({
        grant_type: 'refresh_token',
        user_id: `${walletInfo.address}_ethereum`,
        verify_params: {
          refresh_token
        }
      });
      return;
    }

    await reSign();
  } catch (e) {
    if ((e as MetaMaskError)?.code === 4001) {
      throw new Error((e as MetaMaskError).message);
    }

    await reSign();
  }
}

async function createToken(data: GetTokenParams): Promise<AuthResponse> {
  const res = await axios.post<GetTokenParams, RequestBody<AuthResponse>>(
    `${baseURL}/auth/api/v1/phantaci/metaMask/oauth/token`,
    data
  );

  store.set('authInfo', { ...res.data, signTime: new Date().getTime() });
  emitter.emit(emitterEvent.authChange);

  return res.data;
}

async function refreshToken(data: GetTokenParams) {
  return createToken(data);
}

interface IListResponseBody<T> {
  data: { data: T; message: string; status: string };
  status: number;
  statusText: string;
}

export async function postQueryWithNoAuth<D, R>(url: string, data: D) {
  const resp = await axios.post<RequestBody<D>, IListResponseBody<R>>(
    `${baseURL}/${url}`,
    data
  );

  if (resp.status === 200) {
    return resp.data.data;
  } else {
    throw new Error(resp.data.message);
  }
}
