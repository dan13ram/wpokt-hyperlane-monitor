import { ExternalLinkIcon } from '@chakra-ui/icons';
import { HStack, Link, Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import { useMemo } from 'react';
import { isAddress } from 'viem';

import { getAddressLink, getNetworkConfig, getTxLink } from '@/utils/helpers';

import { CopyText } from './CopyText';

const isETH = (chainId: string) => !Number.isNaN(Number(chainId));

const isPOKT = (chainId: string) => Number.isNaN(Number(chainId));

export const HashDisplay: React.FC<{ children: string; chainId: string }> = ({
  children: hex,
  chainId,
}) => {
  const { label, logo, props } = useMemo(() => {
    let networkLabel = 'unknown';
    let networkLogo = '';
    let logoProps = {};
    if (isETH(chainId)) {
      networkLabel = getNetworkConfig(chainId).chain_name;
      networkLogo = '/eth-logo.png';
      logoProps = {
        width: 9,
        height: 14,
        style: { height: '14px', width: '9px' },
      };
    } else if (isPOKT(chainId)) {
      networkLabel = getNetworkConfig(chainId).chain_name;
      networkLogo = '/pokt-logo.png';
      logoProps = {
        width: 14,
        height: 14,
        style: { height: 'auto', width: '14px' },
      };
    }

    return { label: networkLabel, logo: networkLogo, props: logoProps };
  }, [chainId]);

  const link = useMemo(() => {
    const isAddressValue = hex.startsWith('0x')
      ? isAddress(hex)
      : isAddress(`0x${hex}`);

    if (isAddressValue) {
      return getAddressLink(chainId, hex);
    }

    return getTxLink(chainId, hex);
  }, [chainId, hex]);

  return (
    <HStack
      spacing={1}
      bg="gray.100"
      px={2}
      py={1}
      borderRadius="full"
      justify="space-between"
      w="10.5rem"
    >
      {logo && (
        <HStack spacing={0} justify="center" w={4} flexShrink={0}>
          <Image src={logo} alt={label} {...props} />
        </HStack>
      )}
      <CopyText>{hex}</CopyText>
      {link && (
        <Tooltip
          label={isETH(chainId) ? 'View on Etherscan' : 'View on PoktScan'}
          placement="top"
        >
          <Link href={link} isExternal>
            <ExternalLinkIcon
              mb={1}
              transition="color 0.25s"
              _hover={{ color: 'blue.400' }}
              _active={{ color: 'blue.400' }}
            />
          </Link>
        </Tooltip>
      )}
    </HStack>
  );
};
