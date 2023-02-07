import cn from 'classnames';
import React from 'react';

interface PageNotFoundProps {
  className?: string;
}

function PageNotFound(props: PageNotFoundProps) {
  const { className } = props;

  return <div className={cn(className)}>404</div>;
}

export default PageNotFound;
