import cn from 'classnames';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Web3Context } from '@/libs/web3Store/context';

import * as styles from './SimpleComponent.module.less';

interface SimpleComponentProps {
  className?: string;
}

export function SimpleComponent(props: SimpleComponentProps) {
  const { className } = props;
  const { t } = useTranslation();
  const { walletInfo, connect, unConnect } = useContext(Web3Context);

  return (
    <div className={cn(styles.SimpleComponent, className)}>
      SimpleComponent
      <button onClick={() => void connect()}>connect to ethereum</button>
      <br />
      <button onClick={() => void unConnect()}>unConnect</button>
      <br />
      <p>{JSON.stringify(walletInfo)}</p>
      {t('zh')}
    </div>
  );
}
