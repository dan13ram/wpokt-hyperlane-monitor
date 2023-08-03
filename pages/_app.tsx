import { ChakraProvider } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { WagmiWrapper } from '@/components/WagmiWrapper';
import { globalStyles, theme } from '@/utils/theme';

export default function App({
  Component,
  pageProps,
}: {
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
}): JSX.Element {
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>WPOKT Demo</title>
      </Head>
      <ChakraProvider resetCSS theme={theme}>
        <Global styles={globalStyles} />
        <WagmiWrapper>
          <Component {...pageProps} />
        </WagmiWrapper>
      </ChakraProvider>
    </>
  );
}
