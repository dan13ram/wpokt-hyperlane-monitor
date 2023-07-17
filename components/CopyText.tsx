import { Text, Tooltip, useClipboard } from '@chakra-ui/react';

import { shortenHex } from '@/utils/helpers';

export const CopyText: React.FC<{ children: string }> = ({ children }) => {
  const { onCopy, hasCopied } = useClipboard(children);
  return (
    <Tooltip
      label={hasCopied ? 'Copied!' : 'Copy to clipboard'}
      placement="top"
      hasArrow
      closeOnClick={false}
    >
      <Text onClick={onCopy} cursor="pointer">
        {shortenHex(children)}
      </Text>
    </Tooltip>
  );
};
