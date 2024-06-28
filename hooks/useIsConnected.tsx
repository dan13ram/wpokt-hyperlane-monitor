import { useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';

export const useIsConnected = (): boolean => {
  const { address } = useAccount();
  const chain = useChainId();
  const isConnected = useMemo(() => !!address && !!chain, [address, chain]);
  return isConnected;
};
