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

export const useWPOKTNonceMap = (
  addresses: string[],
  refreshCount = 0,
): Record<string, BigNumber> => {
  const { data: signer } = useSigner();

  const [bnNonceMap, setBnNonceMap] = useState<Record<string, BigNumber>>({});

  const fetchNonce = useCallback(async () => {
    if (!signer) return;
    try {
      const contract = new Contract(
        WRAPPED_POCKET_ADDRESS,
        WRAPPED_POCKET_ABI,
        signer,
      );
      const nonceMap: Record<string, BigNumber> = {};
      for (const address of addresses) {
        nonceMap[address.toLowerCase()] = await contract.getUserNonce(address);
      }
      setBnNonceMap(nonceMap);
    } catch (error) {
      console.error(error);
    }
  }, [addresses, signer]);

  useEffect(() => {
    if (addresses && addresses.length > 0 && signer) {
      fetchNonce();
    }
    const refreshInterval = setInterval(fetchNonce, 10000);
    return () => clearInterval(refreshInterval);
  }, [addresses, fetchNonce, refreshCount, signer]);

  return bnNonceMap;
};
