'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { State, WagmiProvider as InternalWagmiProvider } from 'wagmi';

import { projectId, wagmiConfig } from '@/lib/web3';

const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

createWeb3Modal({
  wagmiConfig,
  projectId,
});

type Props = React.PropsWithChildren<{
  initialState: State | undefined;
}>;

export const WagmiProvider: React.FC<Props> = ({ children, initialState }) => {
  return (
    <InternalWagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </InternalWagmiProvider>
  );
};
