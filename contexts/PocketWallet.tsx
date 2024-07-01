'use client';

import { Link, Text, useToast } from '@chakra-ui/react';
import { Window as KeplrWindow } from '@keplr-wallet/types';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import useSWR from 'swr';

import { poktChainInfo } from '@/utils/config';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export type PocketWalletContextType = {
  poktAddress: string;
  poktNetwork: string;
  poktBalance: bigint;
  isBalanceLoading: boolean;
  reloadPoktBalance: () => void;
  connectPocketWallet: () => Promise<void>;
  sendPokt: (
    amount: bigint,
    recipient: string,
    memo: string,
  ) => Promise<string>;
  isPoktConnected: boolean;
  resetPoktWallet: () => void;
};

export const PocketWalletContext = createContext<PocketWalletContextType>({
  poktBalance: BigInt(0),
  poktNetwork: '',
  isBalanceLoading: false,
  reloadPoktBalance: () => {},
  poktAddress: '',
  connectPocketWallet: async () => {},
  sendPokt: async () => '',
  isPoktConnected: false,
  resetPoktWallet: () => {},
});

export const usePocketWallet = (): PocketWalletContextType =>
  useContext(PocketWalletContext);

export const PocketWalletProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [poktAddress, setPoktAddress] = useState<string>('');
  const [poktNetwork, setPoktNetwork] = useState<string>('');

  const toast = useToast();

  const connectPocketWallet = useCallback(async () => {
    if (window.keplr === undefined) {
      toast({
        title: 'Keplr Wallet not found!',
        description: (
          <Text>
            Please install{' '}
            <Link href="https://www.keplr.app/download" isExternal>
              Keplr Wallet
            </Link>
            {'.'}
          </Text>
        ),
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      await window.keplr.experimentalSuggestChain(poktChainInfo);
      await window.keplr.enable(poktChainInfo.chainId);

      /*
      const [address] = await window.keplr.send('pokt_requestAccounts');

      let network = 'mainnet';
      try {
        const { chain } = await window.keplr.send('pokt_chain');
        if (
          chain.toLowerCase() === 'testnet' ||
          chain.toLowerCase() === 'mainnet'
        ) {
          network = chain.toLowerCase();
        }
      } catch (e) {
        console.error('Error getting POKT network', e);
      }

      setPoktAddress(address);
      setPoktNetwork(network);
      */
    } catch (e) {
      console.error('Error connecting to POKT Wallet', e);
      toast({
        title: 'Error connecting to POKT Wallet',
        description: (e as Error).message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setPoktAddress('');
      setPoktNetwork('');
    }
  }, [toast]);

  const fetchPoktBalance = useCallback(
    async (address: string): Promise<undefined | bigint> => {
      if (!address || !window.keplr) return BigInt(0);
      /*
      const { balance } = await window.keplr.send('pokt_balance', [
        { address },
      ]);
      return BigInt(balance);
        */
      return BigInt(0);
    },
    [],
  );

  const {
    data: poktBalance,
    isLoading: isBalanceLoading,
    mutate: reloadPoktBalance,
  } = useSWR(poktAddress, fetchPoktBalance);

  const sendPokt = useCallback(
    async (
      amount: bigint,
      recipient: string,
      memo: string,
    ): Promise<string> => {
      if (!poktAddress) {
        throw new Error('No POKT wallet connected');
      }
      /*
      const { hash } = await window.keplr.send('pokt_sendTransaction', [
        {
          amount: amount.toString(), // in uPOKT
          from: poktAddress,
          to: recipient,
          memo: memo,
        },
      ]);
      return hash;
        */
      return amount.toString() + recipient + memo;
    },
    [poktAddress],
  );

  const isPoktConnected = useMemo(
    () => !!poktAddress && !!poktNetwork,
    [poktAddress, poktNetwork],
  );

  const resetPoktWallet = useCallback(() => {
    setPoktAddress('');
    setPoktNetwork('');
  }, []);

  return (
    <PocketWalletContext.Provider
      value={{
        poktBalance: poktBalance || BigInt(0),
        poktNetwork,
        isBalanceLoading,
        reloadPoktBalance,
        poktAddress,
        connectPocketWallet,
        sendPokt,
        isPoktConnected,
        resetPoktWallet,
      }}
    >
      {children}
    </PocketWalletContext.Provider>
  );
};
