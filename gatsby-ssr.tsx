import './src/styles/global.css';

import React, { ReactNode } from 'react';

import { Layout } from '@/components/Layout';

interface WrapPageElement {
  element: ReactNode;
  props: Record<string, unknown>;
}

// Wraps every page in a component
export const wrapPageElement = ({ element, props }: WrapPageElement) => {
  return <Layout {...props}>{element}</Layout>;
};
