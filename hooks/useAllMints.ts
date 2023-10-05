import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { Mint, MintData } from '@/types';

import { PaginationType, usePagination } from './usePagination';

async function fetcher(uri: string): Promise<MintData> {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(
      mints =>
        mints || {
          mints: [],
          totalMints: 0,
          page: 1,
          totalPages: 1,
        },
    );
}

export default function useAllMints(): {
  mints: Mint[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
  pagination: PaginationType;
} {
  const [page, setPage] = useState(1);

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    '/api/mints/all?page=' + page,
    fetcher,
  );

  const { mints, totalPages } = useMemo(
    () => data || { mints: [], totalMints: 0, page: 1, totalPages: 1 },
    [data],
  );

  const pagination = usePagination({ totalPages, page, setPage });

  return {
    mints,
    loading: isLoading || isValidating,
    error,
    reload: mutate,
    pagination,
  };
}
