import {
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import Image from 'next/image';

import { NodesPanel } from '@/components/NodesPanel';
import { TotalsTile } from '@/components/TotalsTile';

const HomePage: React.FC = () => {
  return (
    <VStack align="stretch" w="100%" spacing={4} pt={0} pb={10}>
      <Text fontWeight="bold" w="100%" textAlign="center">
        Bridge between POKT on
        <Image
          src="/pokt-logo.png"
          alt="POKT"
          width={16}
          height={16}
          style={{
            display: 'inline-block',
            marginLeft: 5,
            marginRight: 5,
            width: 'auto',
            height: 'auto',
          }}
        />
        Pocket Shannon and WPOKT on
        <Image
          src="/eth-logo.png"
          alt="ETH"
          width={10}
          height={16}
          style={{
            display: 'inline-block',
            marginLeft: 5,
            marginRight: 5,
            width: '10px',
            height: '16px',
          }}
        />
        Ethereum Networks
      </Text>

      <VStack minW="20rem" align="stretch" mx="auto">
        <TotalsTile />
      </VStack>

      <Tabs>
        <HStack justify="center" w="100%">
          <TabList>
            <Tab>
              <Text fontSize="lg">Mints</Text>
            </Tab>
            <Tab>
              <Text fontSize="lg">Burns</Text>
            </Tab>
            <Tab>
              <Text fontSize="lg">Refunds</Text>
            </Tab>
            <Tab>
              <Text fontSize="lg">Nodes</Text>
            </Tab>
          </TabList>
        </HStack>
        <TabPanels>
          <TabPanel px={0}></TabPanel>
          <TabPanel px={0}></TabPanel>
          <TabPanel px={0}></TabPanel>
          <TabPanel px={0}>
            <NodesPanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default HomePage;
