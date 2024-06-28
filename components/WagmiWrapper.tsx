'use client';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ChakraProvider,
  Heading,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { PropsWithChildren, useLayoutEffect } from 'react';
import { State, useAccount } from 'wagmi';

import { WagmiProvider } from '@/contexts/WagmiProvider';
// import { useBalance } from '@/hooks/useBalance';
// import { useIsConnected } from '@/hooks/useIsConnected';
import { shortenHex } from '@/utils/helpers';
import {
  globalStyles,
  PAGE_MAX_WIDTH,
  PAGE_PADDING_X,
  theme,
} from '@/utils/theme';

import { EthIcon } from './EthIcon';
import { PoktIcon } from './PoktIcon';

/*
const InvalidNetwork: React.FC = () => {
  const { isLoading, switchNetwork } = useSwitchNetwork();

  const onSwitch = useCallback(
    () => switchNetwork?.(DEFAULT_CHAIN.id),
    [switchNetwork],
  );

  const { chain } = useNetwork();

  const { poktNetwork } = usePocketWallet();

  const isInvalidEthNetwork = useMemo(
    () => !!chain && chain.id !== DEFAULT_CHAIN.id,
    [chain],
  );

  const isInvalidPoktNetwork = useMemo(
    () => !!poktNetwork && poktNetwork !== POKT_CHAIN_ID,
    [poktNetwork],
  );

  if (!isInvalidEthNetwork && !isInvalidPoktNetwork) {
    return null;
  }

  return (
    <VStack w="100%" bg="red.100" p={6} my={6} borderRadius="md" spacing={4}>
      <Alert status="error" w="auto">
        <AlertIcon />
        <AlertDescription>
          Your{' '}
          {isInvalidEthNetwork
            ? 'ETH wallet is'
            : isInvalidPoktNetwork
              ? 'POKT wallet is'
              : 'wallets are'}{' '}
          connected to an unsupported network.
        </AlertDescription>
      </Alert>
      {isInvalidEthNetwork && (
        <>
          {switchNetwork ? (
            <Button
              onClick={onSwitch}
              isLoading={isLoading}
              leftIcon={<EthIcon boxSize="1.25rem" />}
              bg="gray.700"
              _hover={{ bg: 'gray.900' }}
              _active={{ bg: 'gray.900' }}
              color="white"
            >
              Switch ETH to {DEFAULT_CHAIN.name}
            </Button>
          ) : (
            <Text>
              Please switch your ETH Wallet to{' '}
              <strong>{DEFAULT_CHAIN.name}</strong>
            </Text>
          )}
        </>
      )}
      {isInvalidPoktNetwork && (
        <Text>
          Please switch your POKT Wallet to <strong>{POKT_CHAIN_ID}</strong>
        </Text>
      )}
    </VStack>
  );
};
*/

const WagmiConnectionManager: React.FC<PropsWithChildren> = ({ children }) => {
  const { address } = useAccount();

  const { open } = useWeb3Modal();

  // const { poktAddress, connectPocketWallet } = usePocketWallet();
  //
  const poktAddress = '';

  return (
    <>
      {(!address || !poktAddress) && (
        <VStack w="100%" bg="blue.100" p={6} my={6} borderRadius="md">
          <Alert status="info" w="auto">
            <AlertIcon />
            <AlertDescription>Please connect your wallet(s).</AlertDescription>
          </Alert>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            {!address && (
              <Button
                leftIcon={<EthIcon boxSize="1.25rem" />}
                onClick={() => open()}
                bg="gray.700"
                _hover={{ bg: 'gray.900' }}
                _active={{ bg: 'gray.900' }}
                color="white"
              >
                Connect ETH Wallet
              </Button>
            )}
            {!poktAddress && (
              <Button
                leftIcon={<PoktIcon boxSize="1.25rem" />}
                // onClick={connectPocketWallet}
                colorScheme="blue"
              >
                Connect POKT Wallet
              </Button>
            )}
          </Stack>
        </VStack>
      )}
      {/*(!!address || !!poktAddress) && <InvalidNetwork />*/}
      {children}
    </>
  );
};

const Header: React.FC = () => {
  // const { balance, loading } = useBalance();
  // const isConnected = useIsConnected();
  const { address } = useAccount();

  // const { poktAddress, poktBalance, isBalanceLoading, isPoktConnected } =
  //   usePocketWallet();

  const { open } = useWeb3Modal();

  // const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Stack
      w="100%"
      justifyContent="space-between"
      spacing={4}
      py={4}
      direction={{ base: 'column', xl: 'row' }}
      align="center"
    >
      <Heading size="lg">wPOKT Bridge Monitor</Heading>
      <Stack
        spacing={4}
        direction={{ base: 'column', md: 'row' }}
        align="center"
      >
        {address && (
          <VStack>
            <Button
              leftIcon={<EthIcon boxSize="1rem" />}
              bg="gray.700"
              _hover={{ bg: 'gray.900' }}
              _active={{ bg: 'gray.900' }}
              color="white"
              fontFamily="mono"
              onClick={() => open()}
            >
              <Text mb="-2px">{shortenHex(address, 10)}</Text>
            </Button>
            {/*isConnected && (
              <Text fontSize="sm">
                Balance:{' '}
                {loading ? (
                  <Spinner thickness="2px" speed="0.65s" size="xs" />
                ) : (
                  <Text as="span" fontWeight="bold">
                    {`${formatUnits(balance, 6)} wPOKT`}
                  </Text>
                )}
              </Text>
            )*/}
          </VStack>
        )}
        {/*poktAddress && (
          <VStack>
            <Button
              leftIcon={<PoktIcon boxSize="1rem" />}
              colorScheme="blue"
              fontFamily="mono"
              onClick={onOpen}
            >
              <Text mb="-2px">{shortenHex(poktAddress, 10)}</Text>
            </Button>
            {isPoktConnected && (
              <Text fontSize="sm">
                Balance:{' '}
                {isBalanceLoading ? (
                  <Spinner thickness="2px" speed="0.65s" size="xs" />
                ) : (
                  <Text as="span" fontWeight="bold">
                    {`${formatUnits(poktBalance, 6)} POKT`}
                  </Text>
                )}
              </Text>
            )}
          </VStack>
        )*/}
      </Stack>
      {/*<PocketWalletModal isOpen={isOpen} onClose={onClose} />*/}
    </Stack>
  );
};

type Props = React.PropsWithChildren<{
  initialState: State | undefined;
}>;

export const WagmiWrapper: React.FC<Props> = ({ children, initialState }) => {
  useLayoutEffect(() => {
    window.localStorage.setItem('chakra-ui-color-mode', 'light');
  }, []);

  return (
    <WagmiProvider initialState={initialState}>
      <ChakraProvider resetCSS theme={theme}>
        <Global styles={globalStyles} />
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
      </ChakraProvider>
    </WagmiProvider>
  );
};
