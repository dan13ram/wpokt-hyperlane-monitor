import { useCallback, useEffect, useState } from 'react';

import { WRAPPED_POCKET_ADDRESS } from '@/utils/constants';
import { WRAPPED_POCKET_ABI } from '@/utils/abis';
import { usePublicClient } from 'wagmi';

export const useWPOKTNonceMap = (
  addresses: string[],
  refreshCount = 0,
): Record<string, bigint> => {
  const [bnNonceMap, setBnNonceMap] = useState<Record<string, bigint>>({});
  const publicClient = usePublicClient();

  const fetchNonce = useCallback(async () => {
    if (!addresses || addresses.length == 0 || !publicClient) return;

    try {
      const nonceMap: Record<string, bigint> = {};
      for (const address of addresses) {
        nonceMap[address.toLowerCase()] = (await publicClient.readContract({
          address: WRAPPED_POCKET_ADDRESS,
          abi: WRAPPED_POCKET_ABI,
          functionName: 'getUserNonce',
          args: [address],
        })) as bigint;
      }
      setBnNonceMap(nonceMap);
    } catch (error) {
      console.error(error);
    }
  }, [addresses, publicClient]);

  useEffect(() => {
    fetchNonce();
    const refreshInterval = setInterval(fetchNonce, 10000);
    return () => clearInterval(refreshInterval);
  }, [fetchNonce, refreshCount]);

  return bnNonceMap;
};
