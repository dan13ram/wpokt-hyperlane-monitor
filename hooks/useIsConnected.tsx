import { useMemo } from 'react';
import { useAccount, useNetwork } from 'wagmi';

import { DEFAULT_CHAIN } from '@/lib/web3';

export const useIsConnected = (): boolean => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const isConnected = useMemo(
    () => !!address && !!chain && chain.id === DEFAULT_CHAIN.id,
    [address, chain],
  );
  return isConnected;
};
