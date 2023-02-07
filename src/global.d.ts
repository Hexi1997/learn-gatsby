declare module '*.module.less' {
  const content: { [key: string]: string };
  export = content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module 'gatsby-env-variables' {
  const content: {
    BASE_URL: string;
    ETH_SUPPORT_CHAIN_ID: number;
  };
  export = content;
}
