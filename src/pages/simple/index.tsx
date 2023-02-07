import { SimpleComponent } from '@components/SimpleComponent';
import cn from 'classnames';
import React from 'react';

import * as styles from './index.module.less';

interface SimpleProps {
  className?: string;
}

function Simple(props: SimpleProps) {
  const { className } = props;

  return (
    <div className={cn(styles.Simple, className)}>
      Simple
      <SimpleComponent />
    </div>
  );
}

export default Simple;
