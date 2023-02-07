import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { toast } from 'react-toastify';
import { useMount } from 'react-use';
import store from 'store2';

import { checkIfChainBlockSupport } from '@/utils/common';

import { emitter, emitterEvent } from '../event';
import { WalletInfo, Web3Context } from '../web3Store/context';
import { useRequest } from './useRequest';

interface RequestContext {
  get: <R extends unknown>(
    url: string,
    params?: {
      [key: string]: string;
    }
  ) => Promise<{ data: R }>;
  post: <P, R>(url: string, data?: P) => Promise<{ data: R }>;
  userInfo?: {
    email?: string;
  };
  loading: boolean;
}

export const RequestContext = createContext({} as RequestContext);

interface RequestProviderProps {
  children: JSX.Element;
}

export const RequestProvider = (props: RequestProviderProps) => {
  const { sign, walletInfo, connect } = useContext(Web3Context);

  const axiosInstance = useRequest({ sign, walletInfo });

  const get = useCallback(
    <R extends unknown>(
      url: string,
      params?: {
        [key: string]: string;
      }
    ) => {
      return new Promise<{ data: R }>((resolve) => {
        const axios = axiosInstance.current;

        if (axios && axios.get) {
          resolve(axios.get(url, params));
        } else {
          setTimeout(() => {
            resolve(get(url, params));
          }, 200);
        }
      });
    },
    [axiosInstance]
  );

  const post = useCallback(
    <P, R>(url: string, data: P) => {
      return new Promise<R>((resolve) => {
        const axios = axiosInstance.current;

        if (axios && axios.post) {
          resolve(axios.post<P, R>(url, data));
        } else {
          setTimeout(() => {
            resolve(post(url, data));
          }, 200);
        }
      });
    },
    [axiosInstance]
  );

  useMount(() => {
    const walletInfo = store.get('walletInfo') as WalletInfo;
    if (walletInfo?.address) {
      void connect();
    }
  });

  const [loading, setLoading] = useState(false);
  const [userInfo, setData] = useState<{
    email?: string;
  }>();
  const [refresh, setRefresh] = useState({});

  useMount(() => {
    emitter.on(emitterEvent.refresh, () => {
      setRefresh({});
    });
  });

  useEffect(() => {
    if (!walletInfo.address) {
      setLoading(false);
      setData({});
      return;
    }

    setLoading(true);
    void get<{ email: string }>('/auth/api/v1/user/me')
      .then(({ data }) => {
        setData(data);
      })
      .catch((e) => {
        toast.error((e as Error).message);
      })
      .finally(() => {
        setLoading(false);
      });

    try {
      toast.dismiss();
      checkIfChainBlockSupport(walletInfo.chainId);
    } catch (e) {
      toast.info((e as Error).message, {
        autoClose: false
      });
    }
  }, [get, walletInfo, refresh]);

  return (
    <RequestContext.Provider
      value={{
        get,
        post,
        userInfo,
        loading
      }}
    >
      {props.children}
    </RequestContext.Provider>
  );
};
