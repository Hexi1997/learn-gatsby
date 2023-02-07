import cn from 'classnames';
import React from 'react';

interface {{name}}Props {
  className?: string;
}

export function {{name}}(props: {{name}}Props) {
  const { className } = props;

  return (
    <div className={cn(className)}>{{name}}</div>
  );
}
