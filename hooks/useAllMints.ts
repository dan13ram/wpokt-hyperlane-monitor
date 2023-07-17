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
  const { data, error, mutate } = useSWR('/api/mints/all', fetcher);
  const loading = data === undefined;

  return {
    mints: data || [],
    loading,
    error,
    reload: mutate,
  };
}
