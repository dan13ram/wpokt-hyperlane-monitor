import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { Message, MessageData } from '@/types';

import { PaginationType, usePagination } from './usePagination';

async function fetcher(uri: string): Promise<MessageData> {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(
      messages =>
        messages || {
          messages: [],
          totalMessages: 0,
          page: 1,
          totalPages: 1,
        },
    );
}

export default function useAllMessages(): {
  messages: Message[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
  pagination: PaginationType;
} {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    '/api/messages/all?page=' + page,
    fetcher,
  );

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const pagination = usePagination({ totalPages, page, setPage });

  return {
    messages: data?.messages || [],
    loading: isLoading || isValidating,
    error,
    reload: mutate,
    pagination,
  };
}
