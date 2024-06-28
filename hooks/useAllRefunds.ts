import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { Refund, RefundData } from '@/types';

import { PaginationType, usePagination } from './usePagination';

async function fetcher(uri: string): Promise<RefundData> {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(
      refunds =>
        refunds || {
          refunds: [],
          totalRefunds: 0,
          page: 1,
          totalPages: 1,
        },
    );
}

export default function useAllRefunds(): {
  refunds: Refund[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
  pagination: PaginationType;
} {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    '/api/refunds/all?page=' + page,
    fetcher,
  );

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const pagination = usePagination({ totalPages, page, setPage });

  return {
    refunds: data?.refunds || [],
    loading: isLoading || isValidating,
    error,
    reload: mutate,
    pagination,
  };
}
