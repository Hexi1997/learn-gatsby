import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import WalletConnect from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import { useCallback, useRef, useState } from 'react';
import store from 'store2';
import { v4 as uuidV4 } from 'uuid';
import Web3Modal from 'web3modal';

import { emitter, emitterEvent } from '../../event';

const defaultWalletInfo = {
  address: '',
  networkName: '',
  balance: ''
};

interface WalletConnectProvider {
  enable: () => Promise<void>;
  on: (eventType: string, callback: () => void) => void;
}

export const useEthereumWallet = () => {
  const web3ModalRef = useRef<Web3Modal | null>(null);

  const [walletInfo, setWalletInfo] = useState(defaultWalletInfo);
  const [, setWalletStatus] = useState('unConnect');
  const provider = useRef<Web3Provider | null>(null);

  const getWalletInfo = useCallback(async () => {
    if (provider.current) {
      const network = await provider.current.getNetwork();
      const address = await provider.current.getSigner().getAddress();
      const balance = await provider.current.getBalance(address);

      return {
        address,
        networkName: network.name,
        chainId: network.chainId,
        balance: balance.toString()
      };
    }

    return defaultWalletInfo;
  }, []);

  const unConnect = useCallback(() => {
    if (web3ModalRef.current) {
      web3ModalRef.current.clearCachedProvider();
    }

    if (provider.current) {
      provider.current.removeAllListeners();

      const windowProvider = provider.current
        .provider as unknown as Web3Provider;
      windowProvider.removeAllListeners();
    }

    provider.current = null;
    web3ModalRef.current = null;

    store.remove('walletInfo');
    store.remove('authInfo');
    emitter.emit(emitterEvent.authChange);

    setWalletInfo(defaultWalletInfo);
    setWalletStatus('unConnect');
  }, []);

  const connect = useCallback(async () => {
    setWalletStatus('pending');

    try {
      // eslint-disable-next-line no-inner-declarations
      async function reConnect() {
        unConnect();
        await connect();
      }

      web3ModalRef.current = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            package: WalletConnect,
            options: {
              infuraId: 'e2c85c1882a648c2b267a333f3b3897a'
            }
          }
        }
      });
      const web3 = web3ModalRef.current;

      const ethProvider = (await web3.connect()) as WalletConnectProvider;
      if (!ethProvider)
        throw new Error(
          'No Metamask detected, please install Metamask extension (https://metamask.io/)!'
        );
      await ethProvider.enable();

      provider.current = new ethers.providers.Web3Provider(
        ethProvider as ExternalProvider
      );

      ethProvider.on('chainChanged', () => {
        void reConnect();
      });
      ethProvider.on('accountsChanged', () => {
        void reConnect();
      });

      const walletInfo = await getWalletInfo();
      setWalletInfo(walletInfo);
      store.set('walletInfo', walletInfo);
      setWalletStatus('connected');
    } catch (e) {
      setWalletStatus('unconnect');
    }
  }, [getWalletInfo, unConnect]);

  const sign = useCallback(async () => {
    if (!walletInfo.address) {
      await connect();
    }

    if (!provider.current) throw new Error('Metamask is not connected!');

    const nonce = `
    Welcome to test club!

    Click to sign in and accept the test Terms of Service: https://test.io

    This request will not trigger a blockchain transaction or cost any gas fees.

    Your authentication status will reset after 2 hours.

    Wallet address:
    ${walletInfo.address}

    Nonce:
    ${uuidV4()}
    `;

    const signer = provider.current.getSigner();
    const signature = await signer.signMessage(nonce);
    const address = await signer.getAddress();

    return {
      nonce,
      signature,
      address
    };
  }, [connect, walletInfo.address]);

  const getClient = () => {
    //
  };

  return {
    connect,
    unConnect,
    sign,
    walletInfo,
    getClient
  };
};
