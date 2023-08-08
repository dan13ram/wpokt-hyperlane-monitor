import { useCallback } from 'react';
import { usePublicClient } from 'wagmi';

import { MINT_CONTROLLER_ADDRESS } from '@/utils/constants';
import { MINT_CONTROLLER_ABI } from '@/utils/abis';
import useSWR from 'swr';

export const useSignerThreshold = (): {
  signerThreshold: bigint;
  reload: () => void;
  loading: boolean;
} => {
  const publicClient = usePublicClient();

  const fetchSignerThreshold = useCallback(async () => {
    if (!publicClient) return;
    try {
      const signerThreshold = (await publicClient.readContract({
        address: MINT_CONTROLLER_ADDRESS as `0x${string}`,
        abi: MINT_CONTROLLER_ABI,
        functionName: 'signerThreshold',
        args: [],
      })) as bigint;
      return signerThreshold;
    } catch (error) {
      console.error(error);
      return BigInt(0);
    }
  }, [publicClient]);

  const {
    data: bnSignerThreshold,
    isLoading,
    mutate,
  } = useSWR('signerThreshold', fetchSignerThreshold);

  return {
    signerThreshold: bnSignerThreshold || BigInt(0),
    reload: mutate,
    loading: bnSignerThreshold === undefined || isLoading,
  };
};
