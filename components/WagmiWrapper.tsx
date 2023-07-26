import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { Web3Button, Web3Modal } from '@web3modal/react';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { utils } from 'ethers';
import { useWPOKTBalance } from '@/hooks/useWPOKTBalance';

import { WagmiProvider } from '@/components/WagmiProvider';
import { DEFAULT_CHAIN, ethereumClient, projectId } from '@/lib/web3';
import { PAGE_MAX_WIDTH, PAGE_PADDING_X } from '@/utils/theme';

const InvalidNetwork: React.FC = () => {
  const { isLoading, switchNetwork } = useSwitchNetwork();

  const onSwitch = useCallback(
    () => switchNetwork?.(DEFAULT_CHAIN.id),
    [switchNetwork],
  );

  return (
    <VStack spacing={4}>
      <Text>Your wallet is connected to an unsupported network.</Text>
      {switchNetwork ? (
        <Button onClick={onSwitch} isLoading={isLoading}>
          Switch to {DEFAULT_CHAIN.name}
        </Button>
      ) : (
        <Text>Please switch to {DEFAULT_CHAIN.name}</Text>
      )}
    </VStack>
  );
};

const WagmiConnectionManager: React.FC<PropsWithChildren> = ({ children }) => {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const isInvalidNetwork = useMemo(
    () => !!chain && chain.id !== DEFAULT_CHAIN.id,
    [chain],
  );

  if (!address) {
    return (
      <VStack spacing={4}>
        <Text>Please connect your wallet.</Text>
      </VStack>
    );
  }

  if (isInvalidNetwork) {
    return <InvalidNetwork />;
  }

  return <>{children}</>;
};

const Header: React.FC = () => {
  const balance = useWPOKTBalance();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const isConnected = useMemo(
    () => !!address && !!chain && chain.id === DEFAULT_CHAIN.id,
    [address, chain],
  );
  return (
    <HStack w="100%" justifyContent="space-between" spacing={4} py={4}>
      <Heading size="md">WPOKT Demo</Heading>
      <HStack spacing={4}>
        {isConnected && (
          <Text> Balance: {utils.formatUnits(balance, 6)} WPOKT</Text>
        )}
        <Web3Button />
      </HStack>
    </HStack>
  );
};

export const WagmiWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <WagmiProvider>
      <VStack
        px={PAGE_PADDING_X}
        w="100%"
        flex={1}
        maxW={PAGE_MAX_WIDTH}
        marginX="auto"
      >
        <Header />
        <WagmiConnectionManager>{children}</WagmiConnectionManager>
      </VStack>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </WagmiProvider>
  );
};
