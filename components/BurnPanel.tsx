import {
  Button,
  Divider,
  Input,
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
import { Contract, utils } from 'ethers';
import { useCallback, useState } from 'react';
import { useSigner } from 'wagmi';

import useAllBurns from '@/hooks/useAllBurns';
import { WRAPPED_POCKET_ABI } from '@/utils/abis';
import { WRAPPED_POCKET_ADDRESS } from '@/utils/constants';

import { HashDisplay } from './HashDisplay';

export const BurnPanel: React.FC = () => {
  const { burns, reload, loading } = useAllBurns();

  const toast = useToast();

  const { data: signer } = useSigner();

  const [isLoading, setIsLoading] = useState(false);

  const [value, setValue] = useState('');
  const [address, setAddress] = useState('');

  const burnTokens = useCallback(async () => {
    if (!signer) return;
    try {
      setIsLoading(true);
      const amount = utils.parseUnits(value, 6);
      const recipient = utils.getAddress('0x' + address);
      const burnController = new Contract(
        WRAPPED_POCKET_ADDRESS,
        WRAPPED_POCKET_ABI,
        signer,
      );

      const tx = await burnController.burnAndBridge(amount, recipient);

      const txLink = `https://goerli.etherscan.io/tx/${tx.hash}`;
      toast.closeAll();
      toast({
        title: 'Transaction sent',
        description: (
          <Text>
            Burning tokens, view on{' '}
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
        title: 'Transaction successful. Your tokens are burnt!',
        description:
          'Please wait upto 30 min to recieve your POKT in your wallet',
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
        description: 'Error burning tokens, please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [signer, value, address, toast]);

  return (
    <VStack align="stretch">
      <VStack align="stretch" py={8}>
        <Text>
          To burn your tokens, enter the amount of wPOKT you want to burn and
          click the Burn button
        </Text>
        <VStack align="start" maxW="30rem">
          <Input
            placeholder="Burn Amount"
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          <Input
            placeholder="Recipient Pocket Address"
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
          <Button isLoading={isLoading} onClick={burnTokens} colorScheme="blue">
            Burn
          </Button>
        </VStack>
      </VStack>

      <Divider />

      {!loading && (
        <VStack align="stretch" overflowX="auto">
          <Table maxW="100%">
            <Thead>
              <Tr>
                <Th>Transaction Hash</Th>
                <Th>Block Number</Th>
                <Th>Confirmations</Th>
                <Th>Sender Address</Th>
                <Th>Recipient Address</Th>
                <Th>Amount</Th>
                <Th>Created</Th>
                <Th>Status</Th>
                <Th>Return Tx Hash</Th>
              </Tr>
            </Thead>
            {burns.map(burn => (
              <Tr key={burn._id.toString()}>
                <Td>
                  <HashDisplay chainId={burn.sender_chain_id}>
                    {burn.transaction_hash}
                  </HashDisplay>
                </Td>
                <Td>{burn.block_number}</Td>
                <Td>{burn.confirmations}</Td>
                <Td>
                  <HashDisplay chainId={burn.sender_chain_id}>
                    {burn.sender_address}
                  </HashDisplay>
                </Td>
                <Td>
                  <HashDisplay chainId={burn.recipient_chain_id}>
                    {burn.recipient_address}
                  </HashDisplay>
                </Td>
                <Td>{utils.formatUnits(burn.amount, 6)}</Td>
                <Td>{new Date(burn.created_at).toLocaleString()}</Td>
                <Td>{burn.status}</Td>
                <Td>
                  <HashDisplay chainId={burn.recipient_chain_id}>
                    {burn.return_tx_hash}
                  </HashDisplay>
                </Td>
              </Tr>
            ))}
          </Table>
        </VStack>
      )}

      <Button isLoading={loading} onClick={() => reload()} colorScheme="blue">
        Reload
      </Button>
    </VStack>
  );
};
