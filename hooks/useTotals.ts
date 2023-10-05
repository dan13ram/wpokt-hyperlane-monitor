import { useMemo } from 'react';
import useSWR from 'swr';

async function fetcher(uri: string) {
  return fetch(uri)
    .then(r => r.ok && r.json())
    .then(
      mints =>
        mints || {
          mints: '0',
          burns: '0',
          invalidMints: '0',
        },
    );
}

type TotalAmounts = {
  mints: bigint;
  burns: bigint;
  invalidMints: bigint;
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
        mints: BigInt(0),
        burns: BigInt(0),
        invalidMints: BigInt(0),
      };

    return {
      mints: BigInt(data.mints),
      burns: BigInt(data.burns),
      invalidMints: BigInt(data.invalidMints),
    };
  }, [data]);

  return {
    totals,
    loading: isLoading || isValidating,
    error,
    reload: mutate,
  };
}
