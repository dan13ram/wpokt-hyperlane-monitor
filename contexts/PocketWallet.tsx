import { useToast } from '@chakra-ui/react';
import { createContext, useCallback, useContext, useState } from 'react';
import useSWR from 'swr';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pocketNetwork: any;
  }
}

export type PocketWalletContextType = {
  poktAddress: string;
  poktBalance: bigint;
  isBalanceLoading: boolean;
  reloadPoktBalance: () => void;
  connectSendWallet: () => Promise<void>;
  sendPokt: (
    amount: bigint,
    recipient: string,
    memo: string,
  ) => Promise<string>;
};

export const PocketWalletContext = createContext<PocketWalletContextType>({
  poktBalance: BigInt(0),
  isBalanceLoading: false,
  reloadPoktBalance: () => {},
  poktAddress: '',
  connectSendWallet: async () => {},
  sendPokt: async () => '',
});

export const usePocketWallet = (): PocketWalletContextType =>
  useContext(PocketWalletContext);

export const PocketWalletProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [poktAddress, setPoktAddress] = useState<string>('');

  const toast = useToast();

  const connectSendWallet = useCallback(async () => {
    if (window.pocketNetwork === undefined) {
      toast({
        title: 'SendWallet not found!',
        description: 'Please visit https://sendwallet.net to install',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    // Connect SendWallet
    try {
      const [address] = await window.pocketNetwork.send('pokt_requestAccounts');
      setPoktAddress(address);
    } catch (e) {
      console.error('Error connecting to SendWallet', e);
      toast({
        title: 'Error connecting to SendWallet',
        description: 'Please try again',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setPoktAddress('');
    }
  }, [toast]);

  const fetchPoktBalance = useCallback(
    async (address: string): Promise<undefined | bigint> => {
      if (!address || !window.pocketNetwork) return BigInt(0);
      const { balance } = await window.pocketNetwork.send('pokt_balance', [
        { address },
      ]);
      return BigInt(balance);
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
      const { hash } = await window.pocketNetwork.send('pokt_sendTransaction', [
        {
          amount: amount.toString(), // in uPOKT
          from: poktAddress,
          to: recipient,
          memo: memo,
        },
      ]);
      return hash;
    },
    [poktAddress],
  );

  return (
    <PocketWalletContext.Provider
      value={{
        poktBalance: poktBalance || BigInt(0),
        isBalanceLoading,
        reloadPoktBalance,
        poktAddress,
        connectSendWallet,
        sendPokt,
      }}
    >
      {children}
    </PocketWalletContext.Provider>
  );
};
