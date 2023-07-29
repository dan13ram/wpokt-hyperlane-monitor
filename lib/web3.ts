import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { configureChains, createConfig } from 'wagmi';
import { goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error(
    'Invalid/Missing environment variable: "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"',
  );
}

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const DEFAULT_CHAIN = goerli;

const { publicClient, webSocketPublicClient } = configureChains(
  [DEFAULT_CHAIN],
  [w3mProvider({ projectId }), publicProvider()],
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains: [DEFAULT_CHAIN] }),
  publicClient,
  webSocketPublicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, [DEFAULT_CHAIN]);
