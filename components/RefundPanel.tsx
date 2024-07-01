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
import { formatUnits } from 'viem';

import useAllRefunds from '@/hooks/useAllRefunds';
import { config } from '@/utils/config';
import { humanFormattedDate } from '@/utils/helpers';

import { HashDisplay } from './HashDisplay';
import { Pagination } from './Pagination';
import { Tile } from './Tile';

export const RefundPanel: React.FC = () => {
  const { refunds, reload, loading, pagination } = useAllRefunds();

  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <VStack align="stretch">
      {!loading && isSmallScreen && (
        <VStack align="stretch" overflowX="auto" spacing={4}>
          {refunds.map(refund => {
            return (
              <Tile
                key={refund.origin_transaction_hash}
                entries={[
                  {
                    label: 'Tx Hash',
                    value: (
                      <HashDisplay chainId={config.cosmos_network.chain_id}>
                        {refund.origin_transaction_hash}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Created At',
                    value: humanFormattedDate(refund.created_at),
                  },
                  {
                    label: 'Recipient',
                    value: (
                      <HashDisplay chainId={config.cosmos_network.chain_id}>
                        {refund.recipient}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Amount',
                    value: formatUnits(BigInt(refund.amount), 6),
                  },
                  {
                    label: 'Status',
                    value: (
                      <HStack spacing={1}>
                        <Text>{refund.status}</Text>
                      </HStack>
                    ),
                  },
                  {
                    label: 'Refund Tx Hash',
                    value: refund.transaction_hash ? (
                      <HashDisplay chainId={config.cosmos_network.chain_id}>
                        {refund.transaction_hash}
                      </HashDisplay>
                    ) : (
                      <Text>N/A</Text>
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
                <Th>Recipient</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Refund Tx Hash</Th>
              </Tr>
            </Thead>
            <Tbody>
              {refunds.map(refund => {
                return (
                  <Tr key={refund._id.toString()}>
                    <Td>
                      <HashDisplay chainId={config.cosmos_network.chain_id}>
                        {refund.origin_transaction_hash}
                      </HashDisplay>
                    </Td>
                    <Td>{humanFormattedDate(refund.created_at)}</Td>
                    <Td>
                      <HashDisplay chainId={config.cosmos_network.chain_id}>
                        {refund.recipient}
                      </HashDisplay>
                    </Td>
                    <Td>{formatUnits(BigInt(refund.amount), 6)}</Td>
                    <Td>
                      <HStack spacing={1}>
                        <Text>{refund.status}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      {refund.transaction_hash ? (
                        <HashDisplay chainId={config.cosmos_network.chain_id}>
                          {refund.transaction_hash}
                        </HashDisplay>
                      ) : (
                        <Text>N/A</Text>
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
