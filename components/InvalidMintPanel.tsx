import { Button, Table, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';

import useAllInvalidMints from '@/hooks/useAllInvalidMints';

import { HashDisplay } from './HashDisplay';
import { utils } from 'ethers';

export const InvalidMintPanel: React.FC = () => {
  const { invalidMints, reload, loading } = useAllInvalidMints();

  return (
    <VStack align="stretch">
      {!loading && (
        <VStack align="stretch" overflowX="auto">
          <Table maxW="100%">
            <Thead>
              <Tr>
                <Th>Transaction Hash</Th>
                <Th>Height</Th>
                <Th>Confirmations</Th>
                <Th>Sender Address</Th>
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
                <Td>{utils.formatUnits(invalidMint.amount, 6)}</Td>
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
      )}

      <Button isLoading={loading} onClick={() => reload()}>
        Reload
      </Button>
    </VStack>
  );
};
