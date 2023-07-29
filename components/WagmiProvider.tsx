import { Spinner, VStack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { WagmiConfig } from 'wagmi';

import { useIsMounted } from '@/hooks/useMounted';
import { wagmiConfig } from '@/lib/web3';

export const WagmiProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const isMounted = useIsMounted();

  return isMounted ? (
    <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
  ) : (
    <VStack w="100vw" h="100vh" justify="center" align="center">
      <Spinner color="blue.500" thickness="5px" w="5rem" h="5rem" speed="1s" />
    </VStack>
  );
};
