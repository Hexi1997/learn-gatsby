import cn from 'classnames';
import { Helmet } from 'react-helmet';
import React from 'react';

interface SSRProps {
  className?: string;
  serverData: {message:string};
}

export default function SSR(props: SSRProps) {
  const { className,serverData } = props;

  return (
    <main className={cn(className)}>
        <Helmet title='SSR'/>
        <h1>SSR Page with Dogs</h1>
        <img alt="Happy dog" src={serverData.message} />
    </main>
  );
}

export async function getServerData() {
  try {
    const res = await fetch(`https://dog.ceo/api/breeds/image/random`)

    if (!res.ok) {
      throw new Error(`Response failed`)
    }

    return {
      props: await res.json(),
    }
  } catch (error) {
    return {
      status: 500,
      headers: {},
      props: {}
    }
  }
}