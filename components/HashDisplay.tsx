import { HStack, Tag } from '@chakra-ui/react';

import { CopyText } from './CopyText';

export const HashDisplay: React.FC<{ children: string; chainId: string }> = ({
  children,
  chainId,
}) => {
  let networkLabel = 'unknown';
  if (chainId === '5') {
    networkLabel = 'goerli';
  } else if (chainId === 'testnet') {
    networkLabel = 'pokt testnet';
  }
  return (
    <HStack display="inline-flex" alignItems="center" spacing={2}>
      <CopyText>{children}</CopyText>
      <Tag size="sm">{networkLabel}</Tag>
    </HStack>
  );
};
