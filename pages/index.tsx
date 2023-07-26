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

import { BurnPanel } from '@/components/BurnPanel';
import { HealthPanel } from '@/components/HealthPanel';
import { InvalidMintPanel } from '@/components/InvalidMintPanel';
import { MintPanel } from '@/components/MintPanel';
import Image from 'next/image';

const WrappedPocketPage: React.FC = () => {
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
          }}
        />
        Pocket Testnet and WPOKT on
        <Image
          src="/eth-logo.png"
          alt="ETH"
          width={10}
          height={10}
          style={{
            display: 'inline-block',
            marginLeft: 5,
            marginRight: 5,
          }}
        />
        Ethereum Goerli.
      </Text>

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
              <Text fontSize="lg">Invalid Mints</Text>
            </Tab>
            <Tab>
              <Text fontSize="lg">Validators Health</Text>
            </Tab>
          </TabList>
        </HStack>
        <TabPanels>
          <TabPanel>
            <MintPanel />
          </TabPanel>
          <TabPanel>
            <BurnPanel />
          </TabPanel>
          <TabPanel>
            <InvalidMintPanel />
          </TabPanel>
          <TabPanel>
            <HealthPanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default WrappedPocketPage;
