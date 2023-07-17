import {
  Button,
  Code,
  Link,
  Table,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Contract } from 'ethers';
import { useCallback, useState } from 'react';
import { useSigner } from 'wagmi';

import useAllMints from '@/hooks/useAllMints';
import { Mint } from '@/types';
import { MINT_CONTROLLER_ABI } from '@/utils/abis';
import {
  MINT_CONTROLLER_ADDRESS,
  POKT_MULTISIG_ADDRESS,
} from '@/utils/constants';

import { CopyText } from './CopyText';

export const MintPanel: React.FC = () => {
  const { mints } = useAllMints();

  const toast = useToast();

  const { data: signer } = useSigner();

  const [isLoading, setIsLoading] = useState(false);

  const mintTokens = useCallback(
    async (mint: Mint) => {
      if (!signer) return;
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

      try {
        setIsLoading(true);
        const mintController = new Contract(
          MINT_CONTROLLER_ADDRESS,
          MINT_CONTROLLER_ABI,
          signer,
        );

        const tx = await mintController.mintWrappedPocket(
          mint.data,
          mint.signatures,
        );

        const txLink = `https://goerli.etherscan.io/tx/${tx.hash}`;
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
        await tx.wait();
        toast.closeAll();
        toast({
          title: 'Transaction successful. You tokens are bridged!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
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
      }
    },
    [signer, toast],
  );

  return (
    <VStack align="stretch">
      <Text>To get started please send POKT tokens to our vault address</Text>
      <Text>VAULT ADDRESS: {POKT_MULTISIG_ADDRESS}</Text>

      <Text>Use the `pocket` CLI to send tokens to the vault address</Text>
      <Text>Sample command:</Text>
      <Code>
        {`pocket accounts send-tx 92d75da9086b557764432b66b7d3703c1492771a 7FB0A18CEB4E803F22911F5B85E2727BB3BDF04B 20000000 testnet 10000 '{"address":"0x3F9B2fea60325d733e61bC76598725c5430cD751","chain_id":"5"}'  --remoteCLIURL https://node2.testnet.pokt.network`}
      </Code>

      <Text>
        Once you have sent the tokens, find your transaction below and click the
        Mint button
      </Text>

      <Table maxW="100%">
        <Thead>
          <Tr>
            <Th>Transaction Hash</Th>
            <Th>Height</Th>
            <Th>Sender Address</Th>
            <Th>Sender Chain ID</Th>
            <Th>Recipient Address</Th>
            <Th>Recipient Chain ID</Th>
            <Th>Amount</Th>
            <Th>Created At</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        {mints.map(mint => (
          <Tr key={mint._id.toString()}>
            <Td>
              <CopyText>{mint.transaction_hash}</CopyText>
            </Td>
            <Td>{mint.height}</Td>
            <Td>
              <CopyText>{mint.sender_address}</CopyText>
            </Td>
            <Td>{mint.sender_chain_id}</Td>
            <Td>
              <CopyText>{mint.recipient_address}</CopyText>
            </Td>
            <Td>{mint.recipient_chain_id}</Td>
            <Td>{mint.amount}</Td>
            <Td>{new Date(mint.created_at).toLocaleString()}</Td>
            <Td>{mint.status}</Td>
            <Td>
              {mint.status === 'signed' && (
                <Button isLoading={isLoading} onClick={() => mintTokens(mint)}>
                  Mint
                </Button>
              )}
              {mint.status !== 'signed' && <Text>N/A</Text>}
            </Td>
          </Tr>
        ))}
      </Table>
    </VStack>
  );
};
