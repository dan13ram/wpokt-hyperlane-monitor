import useSWR from 'swr';
import { createPublicClient, Hex, http } from 'viem';
import { useAccount } from 'wagmi';

import { getChainFromChainId } from '@/lib/web3';
import { OmniTokenAbi } from '@/utils/abis';
import { config } from '@/utils/config';

type TokenBalance = Record<number, bigint>; // chainId -> balance

const fetchBalances = async (addr: string) => {
  const balances: TokenBalance = {};
  for (const ethNetwork of config.ethereum_networks) {
    try {
      const chain = getChainFromChainId(ethNetwork.chain_id);
      if (!chain) {
        balances[ethNetwork.chain_id] = BigInt(0);
        continue;
      }
      const publicClient = createPublicClient({
        chain,
        transport: http(ethNetwork.rpc_url),
      });
      const balance = (await publicClient.readContract({
        address: ethNetwork.omni_token_address as Hex,
        abi: OmniTokenAbi,
        functionName: 'balanceOf',
        args: [addr],
      })) as bigint;
      balances[ethNetwork.chain_id] = balance;
    } catch (error) {
      console.error(
        'Failed to fetch balance for chain',
        ethNetwork.chain_id,
        error,
      );
      balances[ethNetwork.chain_id] = BigInt(0);
    }
  }
  return balances;
};

const defaultBalance: TokenBalance = config.ethereum_networks.reduce(
  (acc, network) => {
    acc[network.chain_id] = BigInt(0);
    return acc;
  },
  {} as TokenBalance,
);

export const useBalance = (): {
  balance: TokenBalance;
  reload: () => void;
  loading: boolean;
} => {
  const { address } = useAccount();

  const { data: bnBalance, isLoading, mutate } = useSWR(address, fetchBalances);

  return {
    balance: bnBalance || defaultBalance,
    reload: mutate,
    loading: isLoading,
  };
};
