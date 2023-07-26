import useSWR from 'swr';

import { Mint } from '@/types';

async function fetcher(uri: string) {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(mints => mints || []);
}

export default function useAllMints(): {
  mints: Mint[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
} {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    '/api/mints/all',
    fetcher,
  );

  return {
    mints: data || [],
    loading: data === undefined || isLoading || isValidating,
    error,
    reload: mutate,
  };
}
