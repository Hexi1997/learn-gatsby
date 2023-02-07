import cn from 'classnames';
import React, { ReactNode } from 'react';

interface LayoutProps {
  className?: string;
  children: ReactNode
}

export function Layout(props: LayoutProps) {
  const { className,children } = props;

  return (
    <div className={cn(className)}>
      <header className='text-red-400'>header</header>
      {children}
      <footer>footer</footer>
    </div>
  );
}
