import { useMemo } from 'react';
import useSWR from 'swr';

async function fetcher(uri: string) {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(
      messages =>
        messages || {
          messages: '0',
          refunds: '0',
        },
    );
}

type TotalAmounts = {
  messages: bigint;
  refunds: bigint;
};

export default function useTotals(): {
  totals: TotalAmounts;
  reload: () => void;
  loading: boolean;
  error: Error | null;
} {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    '/api/totals',
    fetcher,
  );

  const totals = useMemo(() => {
    if (!data)
      return {
        messages: BigInt(0),
        refunds: BigInt(0),
      };

    return {
      messages: BigInt(data.messages),
      refunds: BigInt(data.refunds),
    };
  }, [data]);

  return {
    totals,
    loading: isLoading || isValidating,
    error,
    reload: mutate,
  };
}
