import {
  Button,
  Divider,
  Table,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import useHealth from '@/hooks/useHealth';

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
                <Th>Last Health Check At</Th>
                <Th>Next Health Check In</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            {healths.map(health => {
              const healthCheckService = health.service_healths.find(
                ({ name }) => name === 'health',
              );
              return (
                <Tr key={health._id.toString()}>
                  <Td>{health.validator_id}</Td>
                  <Td>
                    <HashDisplay chainId="testnet">
                      {health.pokt_address}
                    </HashDisplay>
                  </Td>
                  <Td>
                    <HashDisplay chainId="5">{health.eth_address}</HashDisplay>
                  </Td>
                  <Td>
                    {healthCheckService
                      ? new Date(
                          healthCheckService.last_sync_time,
                        ).toLocaleString()
                      : new Date(health.created_at).toLocaleString()}
                  </Td>
                  <Td>
                    <TimeDisplay
                      time={
                        healthCheckService?.next_sync_time ||
                        new Date(health.created_at).getTime() + 300 * 1000
                      }
                    />
                  </Td>
                  <Td>
                    {new Date(health.created_at).getTime() >
                    Date.now() - 1000 * 60 * 10
                      ? 'Online'
                      : 'Offline'}
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
