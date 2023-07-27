import {
  Button,
  Code,
  Divider,
  Link,
  Table,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { BigNumber, Contract, utils } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useSigner } from 'wagmi';

import useAllMints from '@/hooks/useAllMints';
import { useWPOKTNonceMap } from '@/hooks/useWPOKTNonce';
import { Mint } from '@/types';
import { MINT_CONTROLLER_ABI } from '@/utils/abis';
import {
  MINT_CONTROLLER_ADDRESS,
  POKT_MULTISIG_ADDRESS,
} from '@/utils/constants';

import { HashDisplay } from './HashDisplay';

function uniqueValues(array: string[]): string[] {
  const map: Record<string, boolean> = {};
  array.forEach(item => {
    map[item] = true;
  });
  return Object.keys(map);
}

export const MintPanel: React.FC = () => {
  const { mints, reload, loading } = useAllMints();

  const addresses = useMemo(
    () => uniqueValues(mints.map(mint => mint.recipient_address)),
    [mints],
  );

  const nonceMap = useWPOKTNonceMap(addresses);

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
      <VStack align="stretch" py={8}>
        <Text>
          To get started please send POKT tokens to our vault address:{' '}
          <strong>{POKT_MULTISIG_ADDRESS}</strong>
        </Text>

        <Text>
          Use the{' '}
          <Link
            isExternal
            href="https://docs.pokt.network/node/environment/#source"
            color="blue.500"
          >
            pocket CLI
          </Link>{' '}
          to send tokens to the vault address. A sample command is given below:
        </Text>
        <Code p={6}>
          {`$ pocket accounts send-tx 92d75da9086b557764432b66b7d3703c1492771a 7FB0A18CEB4E803F22911F5B85E2727BB3BDF04B 20000000 testnet 10000 '{"address":"0x3F9B2fea60325d733e61bC76598725c5430cD751","chain_id":"5"}'  --remoteCLIURL https://node2.testnet.pokt.network`}
        </Code>

        <Text>
          Once you have sent the tokens, find your transaction below and click
          the Mint button to complete the bridging process.
        </Text>
      </VStack>

      <Divider />

      {!loading && (
        <VStack align="stretch" overflowX="auto">
          <Table maxW="100%">
            <Thead>
              <Tr>
                <Th>Transaction Hash</Th>
                <Th>Height</Th>
                <Th>Sender Address</Th>
                <Th>Recipient Address</Th>
                <Th>Amount</Th>
                <Th>Nonce</Th>
                <Th>Created</Th>
                <Th>Status</Th>
                <Th>Action</Th>
                <Th>Mint Tx Hash</Th>
              </Tr>
            </Thead>
            {mints.map(mint => {
              const nonce = nonceMap[mint.recipient_address.toLowerCase()];
              const isMintNotReady = nonce
                ? !mint.nonce || BigNumber.from(mint.nonce).gt(nonce.add(1))
                : true;
              const isMintCompleted = nonce
                ? !!mint.nonce && BigNumber.from(mint.nonce).lte(nonce)
                : true;

              return (
                <Tr key={mint._id.toString()}>
                  <Td>
                    <HashDisplay chainId={mint.sender_chain_id}>
                      {mint.transaction_hash}
                    </HashDisplay>
                  </Td>
                  <Td>{mint.height}</Td>
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
                  <Td>{utils.formatUnits(mint.amount, 6)}</Td>
                  <Td>{mint.nonce}</Td>
                  <Td>{new Date(mint.created_at).toLocaleString()}</Td>
                  <Td>
                    {mint.status}
                    {mint.status === 'pending' && (
                      <Text as="span" ml={1}>
                        ({mint.confirmations}/1)
                      </Text>
                    )}
                  </Td>
                  <Td>
                    {!!nonce &&
                    (mint.status === 'signed' ||
                      (mint.status === 'confirmed' &&
                        mint.signatures.length >= 2)) ? (
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
                            isMintNotReady || isMintCompleted
                              ? false
                              : isLoading
                          }
                          onClick={() => mintTokens(mint)}
                          isDisabled={isMintNotReady || isMintCompleted}
                          colorScheme="blue"
                        >
                          Mint
                        </Button>
                      </Tooltip>
                    ) : (
                      <Text>N/A</Text>
                    )}
                  </Td>
                  <Td>
                    {mint.mint_tx_hash && (
                      <HashDisplay chainId={mint.recipient_chain_id}>
                        {mint.mint_tx_hash}
                      </HashDisplay>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Table>
        </VStack>
      )}

      <Button isLoading={loading} onClick={() => reload()} colorScheme="blue">
        Reload
      </Button>
    </VStack>
  );
};
