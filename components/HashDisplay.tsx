import { HStack } from '@chakra-ui/react';
import Image from 'next/image';
import { useMemo } from 'react';

import { ETH_NETWORK_LABEL, POKT_NETWORK_LABEL } from '@/utils/constants';

import { CopyText } from './CopyText';

export const HashDisplay: React.FC<{ children: string; chainId: string }> = ({
  children,
  chainId,
}) => {
  const { label, logo, props } = useMemo(() => {
    let networkLabel = 'unknown';
    let networkLogo = '';
    let logoProps = {};
    if (chainId === '5' || chainId === '1') {
      networkLabel = `Ethereum ${ETH_NETWORK_LABEL}`;
      networkLogo = '/eth-logo.png';
      logoProps = {
        width: 9,
        height: 14,
        style: { height: '14px', width: '9px' },
      };
    } else if (chainId === 'testnet' || chainId === 'mainnet') {
      networkLabel = `Pocket ${POKT_NETWORK_LABEL}`;
      networkLogo = '/pokt-logo.png';
      logoProps = {
        width: 14,
        height: 14,
        style: { height: 'auto', width: '14px' },
      };
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
      minW="8.5rem"
      maxW="9rem"
    >
      {logo && (
        <HStack spacing={0} justify="center" w={4} flexShrink={0}>
          <Image src={logo} alt={label} {...props} />
        </HStack>
      )}
      <CopyText>{children}</CopyText>
    </HStack>
  );
};
