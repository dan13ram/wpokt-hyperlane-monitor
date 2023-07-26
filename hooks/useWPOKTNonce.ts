import { BigNumber, Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';

import { WRAPPED_POCKET_ADDRESS } from '@/utils/constants';
import { WRAPPED_POCKET_ABI } from '@/utils/abis';

export const useWPOKTNonce = (refreshCount = 0): BigNumber => {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [bnNonce, setBnNonce] = useState(BigNumber.from(0));

  const fetchNonce = useCallback(async () => {
    if (!(address && signer)) return;
    try {
      const contract = new Contract(
        WRAPPED_POCKET_ADDRESS,
        WRAPPED_POCKET_ABI,
        signer,
      );
      const nonce = await contract.getUserNonce(address);
      setBnNonce(nonce);
    } catch (error) {
      console.error(error);
    }
  }, [address, signer]);

  useEffect(() => {
    if (address && signer) {
      fetchNonce();
    }
    const refreshInterval = setInterval(fetchNonce, 10000);
    return () => clearInterval(refreshInterval);
  }, [address, fetchNonce, refreshCount, signer]);

  return bnNonce;
};
