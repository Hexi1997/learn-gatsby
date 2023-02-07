import cn from 'classnames';
import React from 'react';

import Seo from '@/components/seo';

import * as styles from './index.module.less';

interface {{name}}Props {
  className?: string;
}

function {{name}}(props: {{name}}Props) {
  const { className } = props;

  return (
    <div className={cn(styles.{{name}}, className)}>
      <Seo title="{{name}}" />
      {{name}}
    </div>
  );
}

export default {{name}};
