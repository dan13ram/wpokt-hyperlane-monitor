'use client';

import {
  Button,
  Divider,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';

import useAllTransactions from '@/hooks/useAllTransactions';
import { humanFormattedDate } from '@/utils/helpers';

import { HashDisplay } from './HashDisplay';
import { Pagination } from './Pagination';
import { Tile } from './Tile';

export const TransactionPanel: React.FC = () => {
  const { transactions, reload, loading, pagination } = useAllTransactions();

  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <VStack align="stretch">
      {!loading && isSmallScreen && (
        <VStack align="stretch" overflowX="auto" spacing={4}>
          {transactions.map(transaction => {
            return (
              <Tile
                key={transaction.hash}
                entries={[
                  {
                    label: 'Tx Hash',
                    value: (
                      <HashDisplay chainId={transaction.chain.chain_id}>
                        {transaction.hash}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Created At',
                    value: humanFormattedDate(transaction.created_at),
                  },
                  {
                    label: 'Sender',
                    value: (
                      <HashDisplay chainId={transaction.chain.chain_id}>
                        {transaction.from_address}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Recipient',
                    value: (
                      <HashDisplay chainId={transaction.chain.chain_id}>
                        {transaction.to_address}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Status',
                    value: (
                      <HStack spacing={1}>
                        <Text>{transaction.status}</Text>
                      </HStack>
                    ),
                  },
                  /*
                  {
                    label: 'Transaction Tx Hash',
                    value: transaction.transaction_tx_hash ? (
                      <HashDisplay chainId={transaction.recipient_chain_id}>
                        {transaction.transaction_tx_hash}
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
                          (transaction.status === 'signed' ||
                            (transaction.status === 'confirmed' &&
                              transaction.signatures.length >=
                                Number(signerThreshold))) ? (
                          <Tooltip
                            label={
                              isTransactionNotReady
                                ? 'Please complete previous transactions first'
                                : isTransactionCompleted
                                  ? 'Transaction completed, please wait for validators to mark it as complete'
                                  : ''
                            }
                          >
                            <Button
                              isLoading={
                                isLoading &&
                                transaction._id.toString() === currentTransactionId
                              }
                              onClick={() => transactionTokens(transaction)}
                              isDisabled={
                                isTransactionNotReady ||
                                isTransactionCompleted ||
                                !isConnected
                              }
                              colorScheme="blue"
                              maxH="2rem"
                              minW="8.5rem"
                              maxW="9rem"
                              w="100%"
                            >
                              Transaction
                            </Button>
                          </Tooltip>
                        ) : (
                          <Text>N/A</Text>
                        )}
                      </>
                    ),
                  },
                    */
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
                <Th>Recipient</Th>
                <Th>Status</Th>
                {/*<Th>Transaction Tx Hash</Th> */}
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map(transaction => {
                // const nonce = nonceMap[transaction.recipient_address.toLowerCase()];
                // const isTransactionNotReady =
                //   nonce != null
                //     ? !transaction.nonce ||
                //       BigInt(transaction.nonce) > nonce + BigInt(1)
                //     : true;
                // const isTransactionCompleted =
                //   nonce != null
                //     ? !!transaction.nonce && BigInt(transaction.nonce) <= nonce
                //     : true;
                //
                return (
                  <Tr key={transaction._id.toString()}>
                    <Td>
                      <HashDisplay chainId={transaction.chain.chain_id}>
                        {transaction.hash}
                      </HashDisplay>
                    </Td>
                    <Td>{humanFormattedDate(transaction.created_at)}</Td>
                    <Td>
                      <HashDisplay chainId={transaction.chain.chain_id}>
                        {transaction.from_address}
                      </HashDisplay>
                    </Td>
                    <Td>
                      <HashDisplay chainId={transaction.chain.chain_id}>
                        {transaction.to_address}
                      </HashDisplay>
                    </Td>
                    <Td>
                      <HStack spacing={1}>
                        <Text>{transaction.status}</Text>
                      </HStack>
                    </Td>
                    {/*
                    <Td>
                      {transaction.transaction_tx_hash ? (
                        <HashDisplay chainId={transaction.recipient_chain_id}>
                          {transaction.transaction_tx_hash}
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
                            (transaction.status === 'signed' ||
                              (transaction.status === 'confirmed' &&
                                transaction.signatures.length >=
                                  Number(signerThreshold))) ? (
                            <Tooltip
                              label={
                                isTransactionNotReady
                                  ? 'Please complete previous transactions first'
                                  : isTransactionCompleted
                                    ? 'Transaction completed, please wait for validators to mark it as complete'
                                    : ''
                              }
                            >
                              <Button
                                isLoading={
                                  isLoading &&
                                  transaction._id.toString() === currentTransactionId
                                }
                                onClick={() => transactionTokens(transaction)}
                                isDisabled={
                                  isTransactionNotReady ||
                                  isTransactionCompleted ||
                                  !isConnected
                                }
                                colorScheme="blue"
                                maxH="2rem"
                                minW="8.5rem"
                                maxW="9rem"
                                w="100%"
                              >
                                Transaction
                              </Button>
                            </Tooltip>
                          ) : (
                            <Text>N/A</Text>
                          )}
                        </>
                      )}
                    </Td>
                    */}
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
