import { QuestionIcon } from '@chakra-ui/icons';
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
  Tooltip,
  Tr,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { formatUnits } from 'viem';

import useAllInvalidMints from '@/hooks/useAllInvalidMints';
import { humanFormattedDate } from '@/utils/helpers';

import { CopyText } from './CopyText';
import { HashDisplay } from './HashDisplay';
import { Tile } from './Tile';

export const InvalidMintPanel: React.FC = () => {
  const { invalidMints, reload, loading } = useAllInvalidMints();

  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <VStack align="stretch">
      <VStack align="stretch" py={8}>
        <Text>
          Below is a list of mints that were made with incorrect memos. These
          transactions have been flagged due to their invalid memo format or
          missing required information.
        </Text>
      </VStack>
      {!loading && isSmallScreen && (
        <VStack align="stretch" overflowX="auto" spacing={4}>
          {invalidMints.map(invalidMint => (
            <Tile
              key={invalidMint.transaction_hash}
              entries={[
                {
                  label: 'Tx Hash',
                  value: (
                    <HashDisplay chainId={invalidMint.sender_chain_id}>
                      {invalidMint.transaction_hash}
                    </HashDisplay>
                  ),
                },
                {
                  label: 'Height',
                  value: invalidMint.height,
                },
                {
                  label: 'Sender',
                  value: (
                    <HashDisplay chainId={invalidMint.sender_chain_id}>
                      {invalidMint.sender_address}
                    </HashDisplay>
                  ),
                },
                {
                  label: 'Amount',
                  value: formatUnits(BigInt(invalidMint.amount), 6),
                },
                {
                  label: 'Invalid Memo',
                  value: <CopyText maxChars={20}>{invalidMint.memo}</CopyText>,
                },
                {
                  label: 'Created At',
                  value: (
                    <Text whiteSpace="nowrap">
                      {humanFormattedDate(new Date(invalidMint.created_at))}
                    </Text>
                  ),
                },
                {
                  label: 'Status',
                  value: (
                    <Tooltip
                      label={
                        invalidMint.status === 'pending'
                          ? `The transaction has ${invalidMint.confirmations} confirmations out of a total of 1 required.`
                          : ''
                      }
                    >
                      <HStack spacing={1}>
                        <Text>{invalidMint.status}</Text>
                        {invalidMint.status === 'pending' && (
                          <QuestionIcon fontSize="xs" />
                        )}
                      </HStack>
                    </Tooltip>
                  ),
                },
                {
                  label: 'Return Tx Hash',
                  value: invalidMint.return_tx_hash ? (
                    <HashDisplay chainId={invalidMint.sender_chain_id}>
                      {invalidMint.return_tx_hash}
                    </HashDisplay>
                  ) : (
                    'N/A'
                  ),
                },
              ]}
            />
          ))}
        </VStack>
      )}
      {!loading && !isSmallScreen && <Divider />}
      {!loading && !isSmallScreen && (
        <VStack align="stretch" overflowX="auto">
          <Table maxW="100%">
            <Thead>
              <Tr>
                <Th>Tx Hash</Th>
                <Th>Height</Th>
                <Th>Sender</Th>
                <Th>Amount</Th>
                <Th>Invalid Memo</Th>
                <Th>Created At</Th>
                <Th>Status</Th>
                <Th>Return Tx Hash</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invalidMints.map(invalidMint => (
                <Tr key={invalidMint._id.toString()}>
                  <Td>
                    <HashDisplay chainId={invalidMint.sender_chain_id}>
                      {invalidMint.transaction_hash}
                    </HashDisplay>
                  </Td>
                  <Td>{invalidMint.height}</Td>
                  <Td>
                    <HashDisplay chainId={invalidMint.sender_chain_id}>
                      {invalidMint.sender_address}
                    </HashDisplay>
                  </Td>
                  <Td>{formatUnits(BigInt(invalidMint.amount), 6)}</Td>
                  <Td>
                    <CopyText maxChars={20}>{invalidMint.memo}</CopyText>
                  </Td>
                  <Td>
                    <Text whiteSpace="nowrap">
                      {humanFormattedDate(new Date(invalidMint.created_at))}
                    </Text>
                  </Td>
                  <Td>
                    <Tooltip
                      label={
                        invalidMint.status === 'pending'
                          ? `The transaction has ${invalidMint.confirmations} confirmations out of a total of 1 required.`
                          : ''
                      }
                    >
                      <HStack spacing={1}>
                        <Text>{invalidMint.status}</Text>
                        {invalidMint.status === 'pending' && (
                          <QuestionIcon fontSize="xs" />
                        )}
                      </HStack>
                    </Tooltip>
                  </Td>
                  <Td>
                    {invalidMint.return_tx_hash ? (
                      <HashDisplay chainId={invalidMint.sender_chain_id}>
                        {invalidMint.return_tx_hash}
                      </HashDisplay>
                    ) : (
                      'N/A'
                    )}
                  </Td>
                </Tr>
              ))}
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
