import { HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useMemo } from 'react';

import { config } from '@/utils/config';
import { COSMOS_CHAIN_DOMAIN } from '@/utils/cosmos';
import { getNetworkConfig } from '@/utils/helpers';

export const isEthereumChainId = (chainId: string): boolean =>
  config.ethereum_networks.some(n => n.chain_id.toString() === chainId);

export const isCosmosChainId = (chainId: string): boolean =>
  config.cosmos_network.chain_id === chainId ||
  COSMOS_CHAIN_DOMAIN.toString() === chainId;

export const NetworkDisplay: React.FC<{ chainId: string }> = ({ chainId }) => {
  const { label, logo, props } = useMemo(() => {
    let networkLabel = 'unknown';
    let networkLogo = '';
    let logoProps = {};
    if (isEthereumChainId(chainId)) {
      networkLabel = getNetworkConfig(chainId).chain_name;
      networkLogo = '/eth-logo.png';
      logoProps = {
        width: 9,
        height: 14,
        style: { height: '14px', width: '9px' },
      };
    } else if (isCosmosChainId(chainId)) {
      networkLabel = config.cosmos_network.chain_id;
      networkLogo = '/pokt-logo.png';
      logoProps = {
        width: 14,
        height: 14,
        style: { height: 'auto', width: '14px' },
      };
    } else {
      networkLabel = `unknown (${chainId})`;
    }

    return { label: networkLabel, logo: networkLogo, props: logoProps };
  }, [chainId]);

  return (
    <HStack
      spacing={1}
      bg="gray.100"
      px={2}
      py={1}
      borderRadius="full"
      justify="space-between"
      w="6rem"
      display="inline-flex"
    >
      {logo && (
        <HStack spacing={0} justify="center" w={4} flexShrink={0}>
          <Image src={logo} alt={label} {...props} />
        </HStack>
      )}
      <Text>{label}</Text>
    </HStack>
  );
};
