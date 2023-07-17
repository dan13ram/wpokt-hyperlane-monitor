import { BigNumber, Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';

import { WRAPPED_POCKET_ADDRESS } from '@/utils/constants';
import { WRAPPED_POCKET_ABI } from '@/utils/abis';

export const useWPOKTBalance = (refreshCount = 0): BigNumber => {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [bnBalance, setBnBalance] = useState(BigNumber.from(0));

  const fetchBalance = useCallback(async () => {
    if (!(address && signer)) return;
    try {
      const contract = new Contract(
        WRAPPED_POCKET_ADDRESS,
        WRAPPED_POCKET_ABI,
        signer,
      );
      const balance = await contract.balanceOf(address);
      setBnBalance(balance);
    } catch (error) {
      console.error(error);
    }
  }, [address, signer]);

  useEffect(() => {
    if (address && signer) {
      fetchBalance();
    }
    const refreshInterval = setInterval(fetchBalance, 10000);
    return () => clearInterval(refreshInterval);
  }, [address, fetchBalance, refreshCount, signer]);

  return bnBalance;
};
