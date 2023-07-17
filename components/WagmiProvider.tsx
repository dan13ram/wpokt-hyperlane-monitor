import { Spinner } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { WagmiConfig } from 'wagmi';

import { useIsMounted } from '@/hooks/useMounted';
import { wagmiClient } from '@/lib/web3';

export const WagmiProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const isMounted = useIsMounted();

  return isMounted ? (
    <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
  ) : (
    <Spinner />
  );
};
