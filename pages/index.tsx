import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { utils } from 'ethers';

import { BurnPanel } from '@/components/BurnPanel';
import { HealthPanel } from '@/components/HealthPanel';
import { InvalidMintPanel } from '@/components/InvalidMintPanel';
import { MintPanel } from '@/components/MintPanel';
import { useWPOKTBalance } from '@/hooks/useWPOKTBalance';

const WrappedPocketPage: React.FC = () => {
  const balance = useWPOKTBalance();

  return (
    <VStack align="stretch" w="100%" spacing={4} pt={0} pb={10}>
      <Text> WPOKT Balance: {utils.formatUnits(balance, 6)}</Text>
      <Tabs>
        <TabList>
          <Tab>Mint</Tab>
          <Tab>Burn</Tab>
          <Tab>Invalid Mints</Tab>
          <Tab>Validators</Tab>
        </TabList>
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
