import React from 'react';

import { Web3Context } from './context';
import { useEthereumWallet } from './ethereum/useWallet';

interface Web3ProviderProps {
  children: JSX.Element;
}

export const Web3Provider = (props: Web3ProviderProps) => {
  // TODO: 动态替换 context 来支持多链
  const ethereumValue = useEthereumWallet();

  return (
    <Web3Context.Provider value={ethereumValue}>
      {props.children}
    </Web3Context.Provider>
  );
};
