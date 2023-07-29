import { useCallback, useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';

import { WRAPPED_POCKET_ADDRESS } from '@/utils/constants';
import { WRAPPED_POCKET_ABI } from '@/utils/abis';

export const useWPOKTBalance = (refreshCount = 0): bigint => {
  const { address } = useAccount();

  const [bnBalance, setBnBalance] = useState(BigInt(0));

  const publicClient = usePublicClient();

  const fetchBalance = useCallback(async () => {
    if (!address || !publicClient) return;
    try {
      const balance = await publicClient.readContract({
        address: WRAPPED_POCKET_ADDRESS,
        abi: WRAPPED_POCKET_ABI,
        functionName: 'balanceOf',
        args: [address],
      });

      setBnBalance(balance as bigint);
    } catch (error) {
      console.error(error);
    }
  }, [address, publicClient]);

  useEffect(() => {
    fetchBalance();
    const refreshInterval = setInterval(fetchBalance, 10000);
    return () => clearInterval(refreshInterval);
  }, [fetchBalance, refreshCount]);

  return bnBalance;
};
