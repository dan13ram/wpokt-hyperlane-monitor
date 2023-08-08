import { ChakraProvider } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { WagmiWrapper } from '@/components/WagmiWrapper';
import { ETH_CHAIN_ID, POKT_CHAIN_ID } from '@/utils/constants';
import { globalStyles, theme } from '@/utils/theme';

const TITLE = `WPOKT Monitor | Eth ${
  ETH_CHAIN_ID === '5' ? 'Goerli' : 'Mainnet'
} - Pokt ${POKT_CHAIN_ID === 'testnet' ? 'Testnet' : 'Mainnet'}`;

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
        <title>{TITLE}</title>
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
