import 'react-toastify/dist/ReactToastify.css';
import './src/styles/global.less';

import { BaseProvider } from 'baseui';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import { Layout } from '@/components/Layout';
import { I18nextProvider } from '@/i18n';
import { RequestProvider } from '@/libs/authClient/context';
import { Web3Provider } from '@/libs/web3Store/provider';
import { theme } from '@/styles/theme';
interface Route {
  pathname: string;
}

interface OnRouteUpdateProps {
  location: Route;
  prevLocation: Route;
}

// Logs when the client route changes
export const onRouteUpdate = ({
  location,
  prevLocation
}: OnRouteUpdateProps) => {
  console.log('new pathname', location.pathname);
  console.log('old pathname', prevLocation ? prevLocation.pathname : null);
};

export const wrapRootElement = ({ element }: WrapPageElement) => {
  return (
    <I18nextProvider>
      <Web3Provider>
        <RequestProvider>{element}</RequestProvider>
      </Web3Provider>
    </I18nextProvider>
  );
};

interface WrapPageElement {
  element: JSX.Element;
  props: unknown;
}

// Wraps every page in a component
export const wrapPageElement = ({ element }: WrapPageElement) => {
  return (
    <BaseProvider theme={theme}>
      <ToastContainer
        theme="dark"
        autoClose={6000}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        draggable={true}
        pauseOnHover={false}
      />

      <Layout>{element}</Layout>
    </BaseProvider>
  );
};
