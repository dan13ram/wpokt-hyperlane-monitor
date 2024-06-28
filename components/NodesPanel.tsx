'use client';

import {
  Box,
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

import useNodes from '@/hooks/useNodes';
import { config } from '@/utils/config';

import { HashDisplay } from './HashDisplay';
import { Tile } from './Tile';
import { TimeAgo } from './TimeAgo';
import { TimeLeft } from './TimeLeft';

const POKT_CHAIN_ID = config.cosmos_network.chain_id;
const ETH_CHAIN_ID = config.ethereum_networks[0].chain_id.toString();

export const NodesPanel: React.FC = () => {
  const { nodes, reload, loading } = useNodes();

  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <VStack align="stretch">
      {!loading && isSmallScreen && (
        <VStack align="stretch" overflowX="auto" spacing={4}>
          {nodes.map(node => {
            const lastSyncTime = node.updated_at;
            const isOnline =
              new Date(lastSyncTime).getTime() > Date.now() - 1000 * 60 * 10;
            const nextSyncTime = new Date(lastSyncTime).getTime() + 300 * 1000;

            return (
              <Tile
                key={node._id.toString()}
                entries={[
                  {
                    label: 'Validator ID',
                    value: node.oracle_id,
                  },
                  {
                    label: 'Pokt Address',
                    value: (
                      <HashDisplay chainId={POKT_CHAIN_ID}>
                        {node.cosmos_address}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Eth Address',
                    value: (
                      <HashDisplay chainId={ETH_CHAIN_ID}>
                        {node.eth_address}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Last Nodes Check',
                    value: <TimeAgo time={lastSyncTime} />,
                  },
                  {
                    label: 'Next Nodes Check',
                    value: <TimeLeft time={nextSyncTime} />,
                  },
                  {
                    label: 'Status',
                    value: (
                      <HStack>
                        <Box
                          w="10px"
                          h="10px"
                          borderRadius="50%"
                          bg={isOnline ? 'green.500' : 'red.500'}
                        />
                        <Text>{isOnline ? 'Online' : 'Offline'}</Text>
                      </HStack>
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
                <Th>Oracle ID</Th>
                <Th>Pokt Address</Th>
                <Th>Eth Address</Th>
                <Th>Last Nodes Check</Th>
                <Th>Next Nodes Check</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {nodes.map(node => {
                const lastSyncTime = node.updated_at;
                const isOnline =
                  new Date(lastSyncTime).getTime() >
                  Date.now() - 1000 * 60 * 10;
                const nextSyncTime =
                  new Date(lastSyncTime).getTime() + 300 * 1000;

                return (
                  <Tr key={node._id.toString()}>
                    <Td>{node.oracle_id}</Td>
                    <Td>
                      <HashDisplay chainId={POKT_CHAIN_ID}>
                        {node.cosmos_address}
                      </HashDisplay>
                    </Td>
                    <Td>
                      <HashDisplay chainId={ETH_CHAIN_ID}>
                        {node.eth_address}
                      </HashDisplay>
                    </Td>
                    <Td>
                      <TimeAgo time={lastSyncTime} />
                    </Td>
                    <Td>
                      <TimeLeft time={nextSyncTime} />
                    </Td>
                    <Td>
                      <HStack>
                        <Box
                          w="10px"
                          h="10px"
                          borderRadius="50%"
                          bg={isOnline ? 'green.500' : 'red.500'}
                        />
                        <Text>{isOnline ? 'Online' : 'Offline'}</Text>
                      </HStack>
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
