import { Button, HStack, Text } from '@chakra-ui/react';

type PaginationProps = {
  page: number;
  nextPage: () => void;
  prevPage: () => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  page,
  nextPage,
  prevPage,
}) => {
  return (
    <HStack spacing={4}>
      <Button
        onClick={prevPage}
        fontSize="xl"
        colorScheme="blue"
        fontWeight="bold"
      >{`<`}</Button>
      <Text fontWeight="bold" fontSize="xl">
        {page}
      </Text>
      <Button onClick={nextPage} fontSize="xl" colorScheme="blue">{`>`}</Button>
    </HStack>
  );
};
