import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { Burn, BurnData } from '@/types';

import { PaginationType, usePagination } from './usePagination';

async function fetcher(uri: string): Promise<BurnData> {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(
      burns =>
        burns || {
          burns: [],
          totalBurns: 0,
          page: 1,
          totalPages: 1,
        },
    );
}

export default function useAllBurns(): {
  burns: Burn[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
  pagination: PaginationType;
} {
  const [page, setPage] = useState(1);

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    '/api/burns/all?page=' + page,
    fetcher,
  );

  const { burns, totalPages } = useMemo(
    () => data || { burns: [], totalBurns: 0, page: 1, totalPages: 1 },
    [data],
  );

  const pagination = usePagination({ totalPages, page, setPage });

  return {
    burns,
    loading: isLoading || isValidating,
    error,
    reload: mutate,
    pagination,
  };
}
