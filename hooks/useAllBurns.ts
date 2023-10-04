import useSWR from 'swr';

import { Burn } from '@/types';

async function fetcher(uri: string) {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(burns => burns || []);
}

export default function useAllBurns(page = 1): {
  burns: Burn[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
} {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    '/api/burns/all?page=' + page,
    fetcher,
  );

  return {
    burns: data || [],
    loading: isLoading || isValidating,
    error,
    reload: mutate,
  };
}
