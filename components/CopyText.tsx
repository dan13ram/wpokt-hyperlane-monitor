import { Text, Tooltip, useClipboard } from '@chakra-ui/react';

import { shortenHex } from '@/utils/helpers';

export const CopyText: React.FC<{
  children: string;
  shorten?: boolean;
  maxChars?: number;
}> = ({ children, shorten = true, maxChars = 10 }) => {
  const { onCopy, hasCopied } = useClipboard(children);
  return (
    <Tooltip
      label={hasCopied ? 'Copied!' : 'Copy to clipboard'}
      placement="top"
      hasArrow
      closeOnClick={false}
    >
      <Text
        as="span"
        onClick={onCopy}
        cursor="pointer"
        fontFamily="mono"
        transition="color 0.25s"
        _hover={{ color: 'blue.400' }}
        _active={{ color: 'blue.400' }}
      >
        {shorten ? shortenHex(children, maxChars) : children}
      </Text>
    </Tooltip>
  );
};
