import 'react-toastify/dist/ReactToastify.css';
import './src/styles/global.css';

import React from 'react';
import { ToastContainer } from 'react-toastify';

import { Layout } from '@/components/Layout';
import { I18nextProvider } from '@/i18n';

interface WrapPageElement {
  element: JSX.Element;
  props: Record<string, unknown>;
}

export const wrapRootElement = ({ element }: WrapPageElement) => {
  return (
    <I18nextProvider>
      <>
        <ToastContainer
          autoClose={5000}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          draggable={false}
          pauseOnHover={false}
        />
        {element}
      </>
    </I18nextProvider>
  );
};

// Wraps every page in a component
export const wrapPageElement = ({ element, props }: WrapPageElement) => {
  return <Layout {...props}>{element}</Layout>;
};
