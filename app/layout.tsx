import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';

import { WalletWrapper } from '@/components/WalletWrapper';
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
        <WalletWrapper initialState={initialState}>{children}</WalletWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
