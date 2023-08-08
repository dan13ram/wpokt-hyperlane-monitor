import { CheckIcon, CopyIcon, QuestionIcon } from '@chakra-ui/icons';
import {
  Button,
  Code,
  Divider,
  HStack,
  Link,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue,
  useClipboard,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

import useAllMints from '@/hooks/useAllMints';
import { useNonceMap } from '@/hooks/useNonceMap';
import { useSignerThreshold } from '@/hooks/useSignerThreshold';
import { Mint } from '@/types';
import { MINT_CONTROLLER_ABI } from '@/utils/abis';
import {
  MINT_CONTROLLER_ADDRESS,
  POKT_MULTISIG_ADDRESS,
} from '@/utils/constants';
import { humanFormattedDate, uniqueValues } from '@/utils/helpers';

import { HashDisplay } from './HashDisplay';
import { Tile } from './Tile';

const CLI_CODE = `pocket accounts send-tx 92d75da9086b557764432b66b7d3703c1492771a ${POKT_MULTISIG_ADDRESS} 20000000 testnet 10000 '{"address":"0x3F9B2fea60325d733e61bC76598725c5430cD751","chain_id":"5"}'  --remoteCLIURL https://node2.testnet.pokt.network`;

export const MintPanel: React.FC = () => {
  const { mints, reload, loading } = useAllMints();

  const addresses = useMemo(
    () =>
      uniqueValues(
        mints
          .filter(
            mint =>
              mint.status === 'signed' ||
              (mint.status === 'confirmed' && mint.signatures.length >= 2),
          )
          .map(mint => mint.recipient_address),
      ),
    [mints],
  );

  const {
    nonceMap,
    loading: loadingNonce,
    reload: reloadNonce,
  } = useNonceMap(addresses);

  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [currentMintId, setCurrentMintId] = useState<string | null>(null);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const account = useAccount();

  const mintTokens = useCallback(
    async (mint: Mint) => {
      if (!mint.data || !mint.signatures) {
        toast({
          title: 'Error',
          description: 'Mint is not ready',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      if (!account.address || !walletClient || !publicClient) return;

      try {
        setIsLoading(true);
        setCurrentMintId(mint._id.toString());
        const txHash = await walletClient.writeContract({
          account: account.address,
          address: MINT_CONTROLLER_ADDRESS as `0x${string}`,
          abi: MINT_CONTROLLER_ABI,
          functionName: 'mintWrappedPocket',
          args: [mint.data, mint.signatures],
        });

        const txLink = `https://goerli.etherscan.io/tx/${txHash}`;
        toast.closeAll();
        toast({
          title: 'Transaction sent',
          description: (
            <Text>
              Minting tokens, view on{' '}
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
        reloadNonce();
      } catch (error) {
        toast.closeAll();
        // eslint-disable-next-line no-console
        console.error(error);
        toast({
          title: 'Error',
          description: 'Error minting tokens, please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
        setCurrentMintId(null);
      }
    },
    [toast, account.address, walletClient, publicClient, reloadNonce],
  );

  const { onCopy, hasCopied, value, setValue } = useClipboard(CLI_CODE);

  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  const { signerThreshold } = useSignerThreshold();

  return (
    <VStack align="stretch">
      <VStack align="stretch" py={8}>
        <Text>
          {`To get started with minting wPOKT tokens, please follow these steps:`}
          <br />
          <br />
          {`Step 1: Send POKT tokens to our Vault Address:`}
          <br />
          {`Send POKT tokens to our vault address: `}
          <strong>7FB0A18CEB4E803F22911F5B85E2727BB3BDF04B.</strong> You can use
          {`the `}
          <Link
            isExternal
            href="https://docs.pokt.network/node/environment/#source"
            color="blue.500"
          >
            Pocket CLI
          </Link>{' '}
          {`to send tokens to the vault address. Here's a sample command:`}
        </Text>
        <Code my={4} p={0} borderRadius="4px" w="100%">
          <HStack
            borderTopRadius="4px"
            align="center"
            justify="space-between"
            pl={4}
            pr={2}
            py={1}
            bg="blue.100"
          >
            <Text fontSize="xs" fontWeight="bold" as="span">
              shell
            </Text>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onCopy()}
              leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
            >
              {hasCopied ? 'Copied!' : 'Copy code'}
            </Button>
          </HStack>
          <Textarea
            p={6}
            m={0}
            value={value}
            onChange={e => setValue(e.target.value)}
            h="auto"
          />
        </Code>
        <Text>
          {`Step 2: Monitor Your Transaction:`}
          <br />
          {`Once you have sent the POKT tokens, you can find your transaction details below. Please wait for the transaction to be confirmed on the Pocket Testnet before proceeding to the next step.`}
          <br />
          <br />
          {`Step 3: Complete the Bridging Process:`}
          <br />
          {`Once your transaction is confirmed, click the "Mint" button to complete the bridging process and mint wPOKT tokens on the Ethereum Goerli Testnet.`}
          <br />
          <br />
          {`Happy minting!`}
        </Text>
      </VStack>

      {!loading && isSmallScreen && (
        <VStack align="stretch" overflowX="auto" spacing={4}>
          {mints.map(mint => {
            const nonce = nonceMap[mint.recipient_address.toLowerCase()];
            const isMintNotReady =
              nonce != null
                ? !mint.nonce || BigInt(mint.nonce) > nonce + BigInt(1)
                : true;
            const isMintCompleted =
              nonce != null
                ? !!mint.nonce && BigInt(mint.nonce) <= nonce
                : true;

            return (
              <Tile
                key={mint.transaction_hash}
                entries={[
                  {
                    label: 'Tx Hash',
                    value: (
                      <HashDisplay chainId={mint.sender_chain_id}>
                        {mint.transaction_hash}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Sender',
                    value: (
                      <HashDisplay chainId={mint.sender_chain_id}>
                        {mint.sender_address}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Recipient',
                    value: (
                      <HashDisplay chainId={mint.recipient_chain_id}>
                        {mint.recipient_address}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Amount',
                    value: formatUnits(BigInt(mint.amount), 6),
                  },
                  {
                    label: 'Nonce',
                    value: mint.nonce,
                  },
                  {
                    label: 'Created At',
                    value: (
                      <Text whiteSpace="nowrap">
                        {humanFormattedDate(new Date(mint.created_at))}
                      </Text>
                    ),
                  },
                  {
                    label: 'Status',
                    value: (
                      <Tooltip
                        label={
                          mint.status === 'pending'
                            ? `The transaction has ${mint.confirmations} confirmations out of a total of 1 required.`
                            : ''
                        }
                      >
                        <HStack spacing={1}>
                          <Text>{mint.status}</Text>
                          {mint.status === 'pending' && (
                            <QuestionIcon fontSize="xs" />
                          )}
                        </HStack>
                      </Tooltip>
                    ),
                  },
                  {
                    label: 'Mint Tx Hash',
                    value: mint.mint_tx_hash ? (
                      <HashDisplay chainId={mint.recipient_chain_id}>
                        {mint.mint_tx_hash}
                      </HashDisplay>
                    ) : (
                      <>
                        {loadingNonce ? (
                          <Spinner
                            thickness="2px"
                            speed="0.65s"
                            size="sm"
                            color="blue.500"
                          />
                        ) : nonce != null &&
                          (mint.status === 'signed' ||
                            (mint.status === 'confirmed' &&
                              mint.signatures.length >=
                                Number(signerThreshold))) ? (
                          <Tooltip
                            label={
                              isMintNotReady
                                ? 'Please complete previous mints first'
                                : isMintCompleted
                                ? 'Mint completed, please wait for validators to mark it as complete'
                                : ''
                            }
                          >
                            <Button
                              isLoading={
                                isLoading &&
                                mint._id.toString() === currentMintId
                              }
                              onClick={() => mintTokens(mint)}
                              isDisabled={isMintNotReady || isMintCompleted}
                              colorScheme="blue"
                              maxH="2rem"
                              minW="8.5rem"
                              maxW="9rem"
                              w="100%"
                            >
                              Mint
                            </Button>
                          </Tooltip>
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
                <Th>Sender</Th>
                <Th>Recipient</Th>
                <Th>Amount</Th>
                <Th>Nonce</Th>
                <Th>Created At</Th>
                <Th>Status</Th>
                <Th>Mint Tx Hash</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mints.map(mint => {
                const nonce = nonceMap[mint.recipient_address.toLowerCase()];
                const isMintNotReady =
                  nonce != null
                    ? !mint.nonce || BigInt(mint.nonce) > nonce + BigInt(1)
                    : true;
                const isMintCompleted =
                  nonce != null
                    ? !!mint.nonce && BigInt(mint.nonce) <= nonce
                    : true;

                return (
                  <Tr key={mint._id.toString()}>
                    <Td>
                      <HashDisplay chainId={mint.sender_chain_id}>
                        {mint.transaction_hash}
                      </HashDisplay>
                    </Td>
                    <Td>
                      <HashDisplay chainId={mint.sender_chain_id}>
                        {mint.sender_address}
                      </HashDisplay>
                    </Td>
                    <Td>
                      <HashDisplay chainId={mint.recipient_chain_id}>
                        {mint.recipient_address}
                      </HashDisplay>
                    </Td>
                    <Td>{formatUnits(BigInt(mint.amount), 6)}</Td>
                    <Td>{mint.nonce}</Td>
                    <Td>
                      <Text whiteSpace="nowrap">
                        {humanFormattedDate(new Date(mint.created_at))}
                      </Text>
                    </Td>
                    <Td>
                      <Tooltip
                        label={
                          mint.status === 'pending'
                            ? `The transaction has ${mint.confirmations} confirmations out of a total of 1 required.`
                            : ''
                        }
                      >
                        <HStack spacing={1}>
                          <Text>{mint.status}</Text>
                          {mint.status === 'pending' && (
                            <QuestionIcon fontSize="xs" />
                          )}
                        </HStack>
                      </Tooltip>
                    </Td>
                    <Td>
                      {mint.mint_tx_hash ? (
                        <HashDisplay chainId={mint.recipient_chain_id}>
                          {mint.mint_tx_hash}
                        </HashDisplay>
                      ) : (
                        <>
                          {loadingNonce ? (
                            <Spinner
                              thickness="2px"
                              speed="0.65s"
                              size="sm"
                              color="blue.500"
                            />
                          ) : nonce != null &&
                            (mint.status === 'signed' ||
                              (mint.status === 'confirmed' &&
                                mint.signatures.length >=
                                  Number(signerThreshold))) ? (
                            <Tooltip
                              label={
                                isMintNotReady
                                  ? 'Please complete previous mints first'
                                  : isMintCompleted
                                  ? 'Mint completed, please wait for validators to mark it as complete'
                                  : ''
                              }
                            >
                              <Button
                                isLoading={
                                  isLoading &&
                                  mint._id.toString() === currentMintId
                                }
                                onClick={() => mintTokens(mint)}
                                isDisabled={isMintNotReady || isMintCompleted}
                                colorScheme="blue"
                                maxH="2rem"
                                minW="8.5rem"
                                maxW="9rem"
                                w="100%"
                              >
                                Mint
                              </Button>
                            </Tooltip>
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

      <Button isLoading={loading} onClick={() => reload()} colorScheme="blue">
        Reload
      </Button>
    </VStack>
  );
};
