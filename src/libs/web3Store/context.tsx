import { createContext } from 'react';

export interface WalletInfo {
  address: string;
  networkName: string;
  balance: string;
  chainId?: string;
}

interface Web3Context {
  connect: () => Promise<void>;
  unConnect: () => void;
  walletInfo: WalletInfo;
  sign: () => Promise<{
    nonce: string;
    signature: string;
    address: string;
  }>;
  getClient: () => null | undefined | void;
}

export const Web3Context = createContext({
  walletInfo: {
    address: '',
    networkName: '',
    balance: ''
  },
  getClient() {
    //
  }
} as Web3Context);
