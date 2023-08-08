import { useCallback } from 'react';
import { useAccount, usePublicClient } from 'wagmi';

import { WRAPPED_POCKET_ADDRESS } from '@/utils/constants';
import { WRAPPED_POCKET_ABI } from '@/utils/abis';
import useSWR from 'swr';

export const useBalance = (): {
  balance: bigint;
  reload: () => void;
  loading: boolean;
} => {
  const { address } = useAccount();

  const publicClient = usePublicClient();

  const fetchBalance = useCallback(
    async (addr: string) => {
      if (!addr || !publicClient) return;
      try {
        const balance = (await publicClient.readContract({
          address: WRAPPED_POCKET_ADDRESS as `0x${string}`,
          abi: WRAPPED_POCKET_ABI,
          functionName: 'balanceOf',
          args: [addr],
        })) as bigint;
        return balance;
      } catch (error) {
        console.error(error);
        return BigInt(0);
      }
    },
    [address, publicClient],
  );

  const { data: bnBalance, isLoading, mutate } = useSWR(address, fetchBalance);

  return {
    balance: bnBalance || BigInt(0),
    reload: mutate,
    loading: bnBalance === undefined || isLoading,
  };
};
