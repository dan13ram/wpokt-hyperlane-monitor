import { HStack, Spacer, Text, VStack } from '@chakra-ui/react';

export type TileProps = {
  entries: {
    label: string;
    value: JSX.Element | string | number;
  }[];
};

export const Tile: React.FC<TileProps> = ({ entries }) => {
  return (
    <VStack
      align="stretch"
      borderRadius="xl"
      boxShadow="md"
      p={6}
      border="1px solid"
      borderColor="gray.200"
      spacing={1}
    >
      {entries.map(({ label, value }) => (
        <HStack key={label} minH={8}>
          <Text
            fontWeight="bold"
            textTransform="uppercase"
            fontSize="sm"
            color="gray.500"
          >
            {label}
          </Text>
          <Spacer />
          <HStack align="end">
            {typeof value === 'string' || typeof value === 'number' ? (
              <Text>{value}</Text>
            ) : (
              value
            )}
          </HStack>
        </HStack>
      ))}
    </VStack>
  );
};
