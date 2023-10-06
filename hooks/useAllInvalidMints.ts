import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { InvalidMint, InvalidMintData } from '@/types';

import { PaginationType, usePagination } from './usePagination';

async function fetcher(uri: string): Promise<InvalidMintData> {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(
      invalidMints =>
        invalidMints || {
          invalidMints: [],
          page: 1,
          totalInvalidMints: 0,
          totalPages: 0,
        },
    );
}

export default function useAllInvalidMints(): {
  invalidMints: InvalidMint[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
  pagination: PaginationType;
} {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    '/api/invalidMints/all?page=' + page,
    fetcher,
  );

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const pagination = usePagination({ totalPages, page, setPage });

  return {
    invalidMints: data?.invalidMints || [],
    loading: isLoading || isValidating,
    error,
    reload: mutate,
    pagination,
  };
}
