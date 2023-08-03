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
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import useHealth from '@/hooks/useHealth';
import { humanFormattedDate } from '@/utils/helpers';

import { HashDisplay } from './HashDisplay';

const TimeDisplay: React.FC<{ time: number | string | Date }> = ({ time }) => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(n => n + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const now = Date.now();
  const date = new Date(time).getTime();
  const secondsLeft = Math.floor((date - now) / 1000);

  if (secondsLeft <= 0) {
    return <span>0s</span>;
  }

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <span>
      {hours ? `${hours}h` : ''}
      {minutes ? `${minutes}m` : ''}
      {seconds ? `${seconds}s` : ''}
    </span>
  );
};

export const HealthPanel: React.FC = () => {
  const { healths, reload, loading } = useHealth();

  return (
    <VStack align="stretch">
      <Divider />
      {!loading && (
        <VStack align="stretch" overflowX="auto">
          <Table maxW="100%">
            <Thead>
              <Tr>
                <Th>Validator ID</Th>
                <Th>Pokt Address</Th>
                <Th>Eth Address</Th>
                <Th>Last Health Check</Th>
                <Th>Next Health Check</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {healths.map(health => {
                const lastSyncTime = health.updated_at;
                const isOnline =
                  new Date(lastSyncTime).getTime() >
                  Date.now() - 1000 * 60 * 10;
                const nextSyncTime =
                  new Date(lastSyncTime).getTime() + 300 * 1000;

                return (
                  <Tr key={health._id.toString()}>
                    <Td>{health.validator_id}</Td>
                    <Td>
                      <HashDisplay chainId="testnet">
                        {health.pokt_address}
                      </HashDisplay>
                    </Td>
                    <Td>
                      <HashDisplay chainId="5">
                        {health.eth_address}
                      </HashDisplay>
                    </Td>
                    <Td>
                      <Text whiteSpace="nowrap">
                        {humanFormattedDate(new Date(lastSyncTime))}
                      </Text>
                    </Td>
                    <Td>
                      <TimeDisplay time={nextSyncTime} />
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
