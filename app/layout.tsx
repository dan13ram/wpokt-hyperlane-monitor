import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';

import { WagmiWrapper } from '@/components/WagmiWrapper';
import { wagmiConfig } from '@/lib/web3';

const TITLE = `wPOKT Shannon Testnet Bridge Monitor`;

export const metadata: Metadata = {
  title: TITLE,
  description: TITLE,
};

const RootLayout: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  const initialState = cookieToInitialState(
    wagmiConfig,
    headers().get('cookie'),
  );
  return (
    <html lang="en">
      <body>
        <WagmiWrapper initialState={initialState}>{children}</WagmiWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
