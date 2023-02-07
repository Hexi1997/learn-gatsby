import cn from 'classnames';
import { Helmet } from 'react-helmet';
import React from 'react';

interface {{name}}Props {
  className?: string;
}

export function {{name}}(props: {{name}}Props) {
  const { className } = props;

  return (
    <main className={cn(className)}>
        <Helmet title='{{name}}'/>
        <h1>{{name}}</h1>
    </main>
  );
}
