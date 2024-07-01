'use client';

import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { PaginationType } from '@/hooks/usePagination';

export const Pagination: React.FC<PaginationType> = ({
  page,
  nextPage,
  prevPage,
  hasNextPage,
  hasPrevPage,
  lastPage,
  firstPage,
  totalPages,
  goToPage,
}) => {
  const [pageInput, setPageInput] = useState(page);

  useEffect(() => {
    setPageInput(page);
  }, [page]);

  return (
    <HStack spacing={4}>
      <Button
        onClick={firstPage}
        isDisabled={!hasPrevPage}
        fontSize="xl"
        colorScheme="blue"
        fontWeight="bold"
      >{`<<`}</Button>
      <Button
        onClick={prevPage}
        isDisabled={!hasPrevPage}
        fontSize="xl"
        colorScheme="blue"
        fontWeight="bold"
      >{`<`}</Button>
      <InputGroup maxW="8rem">
        <Input
          type="number"
          min={1}
          max={totalPages}
          value={pageInput}
          onChange={e => setPageInput(parseInt(e.target.value))}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              goToPage(pageInput);
            }
          }}
        />
        <InputRightAddon>/ {totalPages}</InputRightAddon>
      </InputGroup>
      <Button
        onClick={nextPage}
        isDisabled={!hasNextPage}
        fontSize="xl"
        colorScheme="blue"
      >{`>`}</Button>
      <Button
        onClick={lastPage}
        isDisabled={!hasNextPage}
        fontSize="xl"
        colorScheme="blue"
      >{`>>`}</Button>
    </HStack>
  );
};
