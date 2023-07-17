import useSWR from 'swr';

import { Burn } from '@/types';

async function fetcher(uri: string) {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(burns => burns || []);
}

export default function useAllBurns(): {
  burns: Burn[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
} {
  const { data, error, mutate } = useSWR('/api/burns/all', fetcher);
  const loading = data === undefined;

  return {
    burns: data || [],
    loading,
    error,
    reload: mutate,
  };
}
