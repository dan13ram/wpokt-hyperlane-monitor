'use client';

import {
  Box,
  Button,
  Divider,
  HStack,
  Input,
  Link,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { concatHex, formatUnits, Hex, isAddress, parseUnits } from 'viem';
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWalletClient,
} from 'wagmi';

import useAllMessages from '@/hooks/useAllMessages';
import { useBalance } from '@/hooks/useBalance';
import { Message } from '@/types';
import { MintControllerAbi, OmniTokenAbi } from '@/utils/abis';
import { config, MintControllerAddress } from '@/utils/config';
import { bech32ToHex, COSMOS_CHAIN_DOMAIN } from '@/utils/cosmos';
import { getTxLink, humanFormattedDate } from '@/utils/helpers';
import {
  addressHexToBytes32,
  encodeMessage,
  formatMessageBody,
} from '@/utils/message';

import { HashDisplay } from './HashDisplay';
import { NetworkDisplay } from './NetworkDisplay';
import { Pagination } from './Pagination';
import { Tile } from './Tile';

const availableDomains: Array<{ value: number; label: string }> =
  config.ethereum_networks
    .map(network => ({
      value: network.chain_id,
      label: 'ethereum ' + network.chain_name,
    }))
    .concat({
      value: COSMOS_CHAIN_DOMAIN,
      label: 'poktroll testnet',
    });

const DomainSelector: React.FC<{
  domain: number;
  setDomain: (domain: number) => void;
  domains: Array<{ value: number; label: string }>;
}> = ({ domain, setDomain, domains }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDomain(parseInt(e.target.value, 10));
  };

  return (
    <Select value={domain} onChange={handleChange}>
      {domains.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
};

export const MessagePanel: React.FC = () => {
  const { messages, reload, loading, pagination } = useAllMessages();

  const toast = useToast();
  const currentChainId = useChainId();

  const [isCompleting, setIsCompleting] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const account = useAccount();
  const isConnected = !!walletClient && !!publicClient && !!account.address;

  const [originDomain, setOriginDomain] = useState<number>(COSMOS_CHAIN_DOMAIN);
  const [destinationDomain, setDestinationDomain] = useState<number>(
    config.ethereum_networks[0].chain_id,
  );

  const fulfillMessage = useCallback(
    async (message: Message) => {
      if (message.status !== 'signed') {
        toast({
          title: 'Error',
          description: 'Message is not ready',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      if (!account.address || !walletClient || !publicClient) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (currentChainId !== message.content.destination_domain) {
        toast({
          title: 'Error',
          description: 'You are not connected to the destination chain',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      try {
        setIsCompleting(true);

        const messageBytes = encodeMessage(message.content);

        const metadata = concatHex(message.signatures.map(s => s.signature));

        setCurrentMessageId(message.message_id.toString());
        toast.closeAll();
        toast({
          title: 'Completing',
          description:
            'Completing order, please confirm the transaction in your wallet',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });

        const txHash = await walletClient.writeContract({
          account: account.address,
          address: MintControllerAddress as `0x${string}`,
          abi: MintControllerAbi,
          functionName: 'fulfillOrder',
          args: [metadata, messageBytes],
        });

        const txLink = getTxLink(publicClient.chain.id.toString(), txHash);
        toast.closeAll();
        toast({
          title: 'Transaction sent',
          description: (
            <Text>
              Fulfilling order, view on{' '}
              <Link isExternal href={txLink}>
                Etherscan
              </Link>{' '}
            </Text>
          ),
          status: 'loading',
          duration: null,
          isClosable: false,
        });
        await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });
        toast.closeAll();
        toast({
          title: 'Transaction successful. You tokens are bridged!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast.closeAll();
        // eslint-disable-next-line no-console
        console.error(error);
        toast({
          title: 'Error',
          description: 'Error fulfilling order, please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsCompleting(false);
        setCurrentMessageId(null);
      }
    },
    [toast, account.address, walletClient, publicClient, currentChainId],
  );

  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <VStack align="stretch">
      <HStack spacing={4} w="100%">
        <DomainSelector
          domain={originDomain}
          setDomain={setOriginDomain}
          domains={availableDomains.filter(d => d.value !== destinationDomain)}
        />
        <Text> {'<-->'} </Text>
        <DomainSelector
          domain={destinationDomain}
          setDomain={setDestinationDomain}
          domains={availableDomains.filter(d => d.value !== originDomain)}
        />
      </HStack>
      {originDomain === COSMOS_CHAIN_DOMAIN ? (
        <FromCosmos />
      ) : (
        <FromEthereum destinationDomain={destinationDomain} />
      )}

      {!loading && isSmallScreen && (
        <VStack align="stretch" overflowX="auto" spacing={4}>
          {messages.map(message => {
            return (
              <Tile
                key={message.origin_transaction_hash}
                entries={[
                  {
                    label: 'Tx Hash',
                    value: (
                      <HashDisplay
                        chainId={message.content.origin_domain.toString()}
                      >
                        {message.origin_transaction_hash}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Created At',
                    value: humanFormattedDate(message.created_at),
                  },
                  {
                    label: 'Sender',
                    value: (
                      <HashDisplay
                        chainId={message.content.origin_domain.toString()}
                      >
                        {message.content.message_body.sender_address}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Origin Chain',
                    value: (
                      <NetworkDisplay
                        chainId={message.content.origin_domain.toString()}
                      />
                    ),
                  },
                  {
                    label: 'Recipient',
                    value: (
                      <HashDisplay
                        chainId={message.content.destination_domain.toString()}
                      >
                        {message.content.message_body.recipient_address}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Destination Chain',
                    value: (
                      <NetworkDisplay
                        chainId={message.content.destination_domain.toString()}
                      />
                    ),
                  },
                  {
                    label: 'Amount',
                    value: formatUnits(
                      BigInt(message.content.message_body.amount),
                      6,
                    ),
                  },
                  {
                    label: 'Status',
                    value: (
                      <HStack spacing={1}>
                        <Text>{message.status}</Text>
                      </HStack>
                    ),
                  },
                  {
                    label: 'Message Tx Hash',
                    value: message.transaction_hash ? (
                      <HashDisplay
                        chainId={message.content.destination_domain.toString()}
                      >
                        {message.transaction_hash}
                      </HashDisplay>
                    ) : (
                      <>
                        {message.status === 'signed' ? (
                          <Button
                            isLoading={
                              isCompleting &&
                              message.message_id === currentMessageId
                            }
                            onClick={() => fulfillMessage(message)}
                            isDisabled={!isConnected}
                            colorScheme="blue"
                            maxH="2rem"
                            minW="8.5rem"
                            maxW="9rem"
                            w="100%"
                          >
                            Complete
                          </Button>
                        ) : (
                          <Text>N/A</Text>
                        )}
                      </>
                    ),
                  },
                ]}
              />
            );
          })}
        </VStack>
      )}

      {!loading && !isSmallScreen && <Divider />}

      {!loading && !isSmallScreen && (
        <VStack align="stretch" overflowX="auto">
          <Table maxW="100%">
            <Thead>
              <Tr>
                <Th>Tx Hash</Th>
                <Th>Created At</Th>
                <Th>Sender</Th>
                <Th>Origin Chain</Th>
                <Th>Recipient</Th>
                <Th>Destination Chain</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Message Tx Hash</Th>
              </Tr>
            </Thead>
            <Tbody>
              {messages.map(message => {
                return (
                  <Tr key={message._id.toString()}>
                    <Td>
                      <HashDisplay
                        chainId={message.content.origin_domain.toString()}
                      >
                        {message.origin_transaction_hash}
                      </HashDisplay>
                    </Td>
                    <Td>{humanFormattedDate(message.created_at)}</Td>
                    <Td>
                      <HashDisplay
                        chainId={message.content.origin_domain.toString()}
                      >
                        {message.content.message_body.sender_address}
                      </HashDisplay>
                    </Td>
                    <Td>
                      <NetworkDisplay
                        chainId={message.content.origin_domain.toString()}
                      />
                    </Td>
                    <Td>
                      <HashDisplay
                        chainId={message.content.destination_domain.toString()}
                      >
                        {message.content.message_body.recipient_address}
                      </HashDisplay>
                    </Td>
                    <Td>
                      <NetworkDisplay
                        chainId={message.content.destination_domain.toString()}
                      />
                    </Td>
                    <Td>
                      {formatUnits(
                        BigInt(message.content.message_body.amount),
                        6,
                      )}
                    </Td>
                    <Td>
                      <HStack spacing={1}>
                        <Text>{message.status}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      {message.transaction_hash ? (
                        <HashDisplay
                          chainId={message.content.destination_domain.toString()}
                        >
                          {message.transaction_hash}
                        </HashDisplay>
                      ) : (
                        <>
                          {message.status === 'signed' ? (
                            <Button
                              isLoading={
                                isCompleting &&
                                message.message_id === currentMessageId
                              }
                              onClick={() => fulfillMessage(message)}
                              isDisabled={!isConnected}
                              colorScheme="blue"
                              maxH="2rem"
                              minW="8.5rem"
                              maxW="9rem"
                              w="100%"
                            >
                              Complete
                            </Button>
                          ) : (
                            <Text>N/A</Text>
                          )}
                        </>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </VStack>
      )}

      <VStack spacing={4} mt={4} w="100%">
        <Pagination {...pagination} />
        <Button isLoading={loading} onClick={() => reload()} colorScheme="blue">
          Reload
        </Button>
      </VStack>
    </VStack>
  );
};

type Props = {
  destinationDomain: number;
};

const FromEthereum: React.FC<Props> = ({ destinationDomain }) => {
  const [value, setValue] = useState('');
  const [address, setAddress] = useState('');

  const { balance: allBalances, loading: isLoadingBalances } = useBalance();
  const [isInitiating, setIsInitiating] = useState(false);

  const toast = useToast();
  const currentChainId = useChainId();

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const account = useAccount();

  const dispatchMessage = useCallback(async () => {
    if (!destinationDomain) {
      toast({
        title: 'Error',
        description: 'Please select a destination domain',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (destinationDomain === currentChainId) {
      toast({
        title: 'Error',
        description: 'You are not connected to the selected chain',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!value) {
      toast({
        title: 'Error',
        description: 'Please enter a message amount',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (isLoadingBalances) {
      toast({
        title: 'Error',
        description: 'Please wait for balances to load',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const balance = allBalances[currentChainId];

    const amount = parseUnits(value, 6);
    if (amount > balance) {
      toast({
        title: 'Error',
        description: 'You do not have enough tokens to send',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!isAddress(address)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid recipient eth address',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const originConfig = config.ethereum_networks.find(
      network => network.chain_id === currentChainId,
    );

    if (!originConfig) {
      toast({
        title: 'Error',
        description: 'No origin network found',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    let destMintControllerAddress: Hex = config.ethereum_networks.find(
      network => network.chain_id === destinationDomain,
    )?.mint_controller_address as Hex;

    if (
      !destMintControllerAddress &&
      destinationDomain === COSMOS_CHAIN_DOMAIN
    ) {
      destMintControllerAddress = bech32ToHex(
        config.cosmos_network.multisig_address,
      );
    }

    if (!destMintControllerAddress) {
      toast({
        title: 'Error',
        description: 'No mint controller address found for destination',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!walletClient || !publicClient || !account.address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsInitiating(true);

      const senderAddress = account.address as Hex;
      const recipientAddress = address as Hex;

      const messageBody = formatMessageBody(
        recipientAddress,
        amount,
        senderAddress,
      );

      const args = [
        destinationDomain,
        addressHexToBytes32(destMintControllerAddress),
        messageBody,
      ];

      const approvedAmount = (await publicClient.readContract({
        address: originConfig.omni_token_address as Hex,
        abi: OmniTokenAbi,
        functionName: 'allowance',
        args: [senderAddress, originConfig.mint_controller_address as Hex],
      })) as bigint;

      if (approvedAmount < amount) {
        toast.closeAll();
        toast({
          title: 'Needs approval',
          description:
            'Approving tokens, please confirm the transaction in your wallet',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
        const approveHash = await walletClient.writeContract({
          address: originConfig.omni_token_address as Hex,
          abi: OmniTokenAbi,
          functionName: 'approve',
          args: [originConfig.mint_controller_address as Hex, amount],
        });
        const txLink = getTxLink(currentChainId.toString(), approveHash);
        toast.closeAll();
        toast({
          title: 'Transaction sent',
          description: (
            <Text>
              Approving tokens, view on{' '}
              <Link isExternal href={txLink}>
                Etherscan
              </Link>{' '}
            </Text>
          ),
          status: 'loading',
          duration: null,
          isClosable: true,
        });

        await publicClient.waitForTransactionReceipt({
          hash: approveHash,
        });
        toast.closeAll();
        toast({
          title: 'Transaction successful',
          description: 'Tokens approved',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      toast.closeAll();
      toast({
        title: 'Initiating',
        description:
          'Initiating order, please confirm the transaction in your wallet',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      const hash = await walletClient.writeContract({
        address: originConfig.mint_controller_address as Hex,
        abi: MintControllerAbi,
        functionName: 'initiateOrder',
        args: args,
      });

      const txLink = getTxLink(currentChainId.toString(), hash);
      toast.closeAll();
      toast({
        title: 'Transaction sent',
        description: (
          <Text>
            Initiating order, view on{' '}
            <Link isExternal href={txLink}>
              Etherscan
            </Link>{' '}
          </Text>
        ),
        status: 'loading',
        duration: null,
        isClosable: true,
      });

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      toast.closeAll();
      toast({
        title: 'Transaction successful',
        description: 'Order initiated',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast.closeAll();
      // eslint-disable-next-line no-console
      console.error(error);
      toast({
        title: 'Error',
        description: 'Error initiating, please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsInitiating(false);
    }
  }, [
    value,
    address,
    toast,
    allBalances,
    currentChainId,
    destinationDomain,
    isLoadingBalances,
    account,
    publicClient,
    walletClient,
  ]);

  return (
    <VStack align="stretch" py={8}>
      <Text as="div">
        {`To get started with your wPOKT tokens, please follow these steps:`}
        <br />
        <br />
        {`Step 1: Initiate bridging process: `}
        <br />
        {`In the input fields below, enter the amount of wPOKT tokens you want to send and the recipient's Ethereum address.`}
      </Text>
      <VStack align="start" maxW="30rem" my={4}>
        <Input
          placeholder="Amount"
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <Input
          placeholder="Recipient Ethereum Address"
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </VStack>
      <Text>
        {`Step 2: Click the "Initiate Briding" Button`}
        <br />
        {`After entering the required information, click the "Initiate Bridging" button to initiate the messageing process.`}
        <Button
          isLoading={isInitiating}
          onClick={() => dispatchMessage()}
          colorScheme="blue"
          maxW="30rem"
          px={8}
          my={4}
          display="flex"
        >
          Initiate Bridging
        </Button>
      </Text>
      <Text>
        {`Step 2: Monitor Your Transaction:`}
        <br />
        {`Once you have sent the POKT tokens, you can find your transaction details below. Please wait for the transaction to be confirmed on the Pocket network before proceeding to the next step.`}
        <br />
        <br />
        {`Step 3: Complete the Bridging Process:`}
        <br />
        {`Once your transaction is confirmed, click the "Complete" button to complete the bridging process and mint wPOKT tokens on the Ethereum network.`}
        <br />
      </Text>
    </VStack>
  );
};

const FromCosmos: React.FC = () => (
  <VStack align="stretch" py={8}>
    <Text as="div">
      {`To get started with your POKT tokens, please follow these steps:`}
      <br />
      <br />
      {`Step 1: Send POKT tokens to our Vault Address: `}
      <Box display="inline-block" ml={2}>
        <HashDisplay chainId={config.cosmos_network.chain_id}>
          {config.cosmos_network.multisig_address}
        </HashDisplay>
      </Box>
    </Text>
    {/*
        <VStack align="start" maxW="30rem" my={4}>
          <Input
            placeholder="Message Amount"
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          <Input
            placeholder="Recipient Ethereum Address"
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </VStack>
        <Text>
          {`Step 2: Click the "Send POKT" Button`}
          <br />
          {`After entering the required information, click the "Send POKT" button to initiate the messageing process.`}
          <Button
            isLoading={isSending}
            onClick={sendTokens}
            colorScheme="blue"
            maxW="30rem"
            px={8}
            my={4}
            display="flex"
            isDisabled={!isPoktConnected}
          >
            Send POKT
          </Button>
        </Text>
        */}
    <Text>
      <br />
      {`Step 2: Monitor Your Transaction:`}
      <br />
      {`Once you have sent the POKT tokens, you can find your transaction details below. Please wait for the transaction to be confirmed on the Pocket network before proceeding to the next step.`}
      <br />
      <br />
      {`Step 3: Complete the Bridging Process:`}
      <br />
      {`Once your transaction is confirmed, click the "Complete" button to complete the bridging process and mint wPOKT tokens on the Ethereum network.`}
      <br />
    </Text>
  </VStack>
);
