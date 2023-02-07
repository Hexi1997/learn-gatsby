import { ETH_SUPPORT_CHAIN_ID } from 'gatsby-env-variables';

export function getDocument() {
  if (typeof document !== `undefined`) return document;

  return null;
}

export function getWindow() {
  if (typeof window !== `undefined`) return window;

  return null;
}

export function ellipsisAddress(address: string) {
  if (address) {
    return `${address.slice(0, 6)}...${address.substr(-4, 4)}`;
  }
  return address;
}

export function checkIfChainBlockSupport(chainId?: string) {
  if (!chainId) return;
  const supportChainId = Number(ETH_SUPPORT_CHAIN_ID);

  if (supportChainId === 1) {
    if (supportChainId !== Number(chainId)) {
      const msg = 'Wrong network, please connect to Ethereum Mainnet.';

      throw new Error(msg);
    }
  }

  if (supportChainId === 4) {
    if (supportChainId !== Number(chainId)) {
      const msg = 'Wrong network, please connect to Rinkeby.';

      throw new Error(msg);
    }
  }
}
