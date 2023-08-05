import { useCallback, useEffect, useState } from 'react';

import { WRAPPED_POCKET_ADDRESS } from '@/utils/constants';
import { WRAPPED_POCKET_ABI } from '@/utils/abis';
import { usePublicClient } from 'wagmi';
import useSWR from 'swr';

export const useNonceMap = (
  addresses: string[],
): {
  nonceMap: Record<string, bigint>;
  loading: boolean;
  reload: () => void;
} => {
  const publicClient = usePublicClient();

  const fetchNonce = useCallback(
    async (addrs: string[]) => {
      if (!addrs || addrs.length == 0 || !publicClient) return;

      try {
        const nonceMap: Record<string, bigint> = {};
        for (const address of addrs) {
          nonceMap[address.toLowerCase()] = (await publicClient.readContract({
            address: WRAPPED_POCKET_ADDRESS,
            abi: WRAPPED_POCKET_ABI,
            functionName: 'getUserNonce',
            args: [address],
          })) as bigint;
        }
        return nonceMap;
      } catch (error) {
        console.error(error);
        return {};
      }
    },
    [publicClient],
  );

  const { data: bnNonceMap, isLoading, mutate } = useSWR(addresses, fetchNonce);

  return {
    nonceMap: bnNonceMap || {},
    loading: isLoading || bnNonceMap === undefined,
    reload: mutate,
  };
};
