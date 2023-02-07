import { AxiosInstance as AxiosInstanceType } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useMount } from 'react-use';
import store from 'store2';

import { emitter, emitterEvent } from '../event';
import { WalletInfo } from '../web3Store/context';
import { AuthResponse, AxiosInstance, baseURL } from './request';

interface useRequestParams {
  sign: () => Promise<{
    nonce: string;
    signature: string;
    address: string;
  }>;
  walletInfo: WalletInfo;
}

export function useRequest(params: useRequestParams) {
  const { sign, walletInfo } = params;
  const instance = useRef<AxiosInstanceType>();

  const [authInfo, setAuthInfo] = useState<AuthResponse>(store.get('authInfo'));

  useMount(() => {
    emitter.on(emitterEvent.authChange, () => {
      const authInfo = store.get('authInfo') as AuthResponse;

      setAuthInfo(authInfo);
    });
  });

  useEffect(() => {
    if (!walletInfo.address) {
      instance.current = undefined;
      return;
    }

    instance.current = AxiosInstance(baseURL, walletInfo, sign, authInfo);
  }, [authInfo, sign, walletInfo]);

  return instance;
}
