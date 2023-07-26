import { HStack, Tag, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useMemo } from 'react';

import { CopyText } from './CopyText';

export const HashDisplay: React.FC<{ children: string; chainId: string }> = ({
  children,
  chainId,
}) => {
  const { label, logo, props } = useMemo(() => {
    let networkLabel = 'unknown';
    let networkLogo = '';
    let logoProps = {};
    if (chainId === '5') {
      networkLabel = 'goerli';
      networkLogo = '/eth-logo.png';
      logoProps = { width: 10, height: 10 };
    } else if (chainId === 'testnet') {
      networkLabel = 'testnet';
      networkLogo = '/pokt-logo.png';
      logoProps = { width: 14, height: 14 };
    }

    return { label: networkLabel, logo: networkLogo, props: logoProps };
  }, [chainId]);

  return (
    <HStack display="inline-flex" alignItems="center" spacing={2}>
      <CopyText>{children}</CopyText>
      <HStack
        spacing={logo ? 1 : 0}
        fontSize="xs"
        bg="gray.100"
        flexShrink={0}
        px={1}
        borderRadius="full"
      >
        {logo && <Image src={logo} alt={label} {...props} />}
        <Text>{label}</Text>
      </HStack>
    </HStack>
  );
};
