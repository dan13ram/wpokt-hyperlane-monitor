import { Table, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';

import useAllInvalidMints from '@/hooks/useAllInvalidMints';

import { HashDisplay } from './HashDisplay';

export const InvalidMintPanel: React.FC = () => {
  const { invalidMints } = useAllInvalidMints();

  return (
    <VStack align="stretch">
      <Table maxW="100%">
        <Thead>
          <Tr>
            <Th>Transaction Hash</Th>
            <Th>Height</Th>
            <Th>Confirmations</Th>
            <Th>Sender Address</Th>
            <Th>Sender Chain ID</Th>
            <Th>Amount</Th>
            <Th>Created At</Th>
            <Th>Status</Th>
            <Th>Return Tx Hash</Th>
          </Tr>
        </Thead>
        {invalidMints.map(invalidMint => (
          <Tr key={invalidMint._id.toString()}>
            <Td>
              <HashDisplay chainId={invalidMint.sender_chain_id}>
                {invalidMint.transaction_hash}
              </HashDisplay>
            </Td>
            <Td>{invalidMint.height}</Td>
            <Td>{invalidMint.confirmations}</Td>
            <Td>
              <HashDisplay chainId={invalidMint.sender_chain_id}>
                {invalidMint.sender_address}
              </HashDisplay>
            </Td>
            <Td>{invalidMint.sender_chain_id}</Td>
            <Td>{invalidMint.amount}</Td>
            <Td>{new Date(invalidMint.created_at).toLocaleString()}</Td>
            <Td>{invalidMint.status}</Td>
            <Td>
              <HashDisplay chainId={invalidMint.sender_chain_id}>
                {invalidMint.return_tx_hash}
              </HashDisplay>
            </Td>
          </Tr>
        ))}
      </Table>
    </VStack>
  );
};
