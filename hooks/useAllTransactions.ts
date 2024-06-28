import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { Transaction, TransactionData } from '@/types';

import { PaginationType, usePagination } from './usePagination';

async function fetcher(uri: string): Promise<TransactionData> {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(
      transactions =>
        transactions || {
          transactions: [],
          totalTransactions: 0,
          page: 1,
          totalPages: 1,
        },
    );
}

export default function useAllTransactions(): {
  transactions: Transaction[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
  pagination: PaginationType;
} {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    '/api/transactions/all?page=' + page,
    fetcher,
  );

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const pagination = usePagination({ totalPages, page, setPage });

  return {
    transactions: data?.transactions || [],
    loading: isLoading || isValidating,
    error,
    reload: mutate,
    pagination,
  };
}
