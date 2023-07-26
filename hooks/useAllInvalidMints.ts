import useSWR from 'swr';

import { InvalidMint } from '@/types';

async function fetcher(uri: string) {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(invalidMints => invalidMints || []);
}

export default function useAllInvalidMints(): {
  invalidMints: InvalidMint[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
} {
  const { data, error, mutate, isLoading, isValidating } = useSWR('/api/invalidMints/all', fetcher);

  return {
    invalidMints: data || [],
    loading: data === undefined || isLoading || isValidating,
    error,
    reload: mutate,
  };
}
