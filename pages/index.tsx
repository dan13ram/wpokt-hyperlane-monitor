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

import { BurnPanel } from '@/components/BurnPanel';
import { HealthPanel } from '@/components/HealthPanel';
import { InvalidMintPanel } from '@/components/InvalidMintPanel';
import { MintPanel } from '@/components/MintPanel';
import { ETH_CHAIN_ID, POKT_CHAIN_ID } from '@/utils/constants';

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
            width: 'auto',
            height: 'auto',
          }}
        />
        Pocket {POKT_CHAIN_ID === 'mainnet' ? 'Mainnet' : 'Testnet'} and WPOKT
        on
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
        Ethereum {ETH_CHAIN_ID === 'mainnet' ? 'Mainnet' : 'Goerli'}
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
          <TabPanel px={0}>
            <MintPanel />
          </TabPanel>
          <TabPanel px={0}>
            <BurnPanel />
          </TabPanel>
          <TabPanel px={0}>
            <InvalidMintPanel />
          </TabPanel>
          <TabPanel px={0}>
            <HealthPanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default WrappedPocketPage;
