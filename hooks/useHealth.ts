import useSWR from 'swr';

import { Health } from '@/types';

async function fetcher(uri: string) {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(healths => healths || []);
}

export default function useHealth(): {
  healths: Health[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
} {
  const { data, error, mutate, isLoading, isValidating } = useSWR('/api/health', fetcher);

  return {
    healths: data || [],
    loading: isLoading || isValidating,
    error,
    reload: mutate,
  };
}
