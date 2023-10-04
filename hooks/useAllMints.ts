import useSWR from 'swr';

import { Mint } from '@/types';

async function fetcher(uri: string) {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(mints => mints || []);
}

export default function useAllMints(page = 1): {
  mints: Mint[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
} {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    '/api/mints/all?page=' + page,
    fetcher,
  );

  return {
    mints: data || [],
    loading: isLoading || isValidating,
    error,
    reload: mutate,
  };
}
