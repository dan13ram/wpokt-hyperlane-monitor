import useSWR from 'swr';

import { InvalidMint } from '@/types';

async function fetcher(uri: string) {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(invalidMints => invalidMints || []);
}

export default function useAllInvalidMints(page = 1): {
  invalidMints: InvalidMint[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
} {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    '/api/invalidMints/all?page=' + page,
    fetcher,
  );

  return {
    invalidMints: data || [],
    loading: isLoading || isValidating,
    error,
    reload: mutate,
  };
}
