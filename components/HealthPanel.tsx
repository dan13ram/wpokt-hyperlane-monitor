import { Button, Table, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import useHealth from '@/hooks/useHealth';

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
      {!loading &&
      <VStack align="stretch" overflowX="auto">
        <Table maxW="100%">
          <Thead>
            <Tr>
              <Th>Hostname</Th>
              <Th>Last Sync At</Th>
              <Th>Next Sync</Th>
              <Th>Status</Th>
              {healths[0]?.service_healths
                .filter(({ name }) => name !== 'health')
                .map(serviceHealth => (
                  <Th key={serviceHealth.name}>{serviceHealth.name}</Th>
                ))}
            </Tr>
          </Thead>
          {healths.map(health => {
            const healthCheckService = health.service_healths.find(
              ({ name }) => name === 'health',
            );
            return (
              <Tr key={health._id.toString()}>
                <Td>{health.hostname}</Td>
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
                {health.service_healths
                  .filter(({ name }) => name !== 'health')
                  .map(serviceHealth => (
                    <Td key={serviceHealth.name}>
                      Synced at{' '}
                      {new Date(
                        serviceHealth.last_sync_time,
                      ).toLocaleTimeString()}
                    </Td>
                  ))}
              </Tr>
            );
          })}
        </Table>
      </VStack>}

      <Button isLoading={loading} onClick={() => reload()}>
        Reload
      </Button>
    </VStack>
  );
};
