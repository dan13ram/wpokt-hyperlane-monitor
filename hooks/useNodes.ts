import useSWR from 'swr';

import { Node } from '@/types';

async function fetcher(uri: string) {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(nodes => nodes || []);
}

export default function useNodes(): {
  nodes: Node[];
  reload: () => void;
  loading: boolean;
  error: Error | null;
} {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    '/api/nodes',
    fetcher,
  );

  return {
    nodes: data || [],
    loading: isLoading || isValidating,
    error,
    reload: mutate,
  };
}
