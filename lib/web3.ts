import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { configureChains, createConfig } from 'wagmi';
import { goerli, mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { ETH_CHAIN_ID, WALLETCONNECT_PROJECT_ID } from '@/utils/constants';

export const projectId = WALLETCONNECT_PROJECT_ID;

export const DEFAULT_CHAIN = ETH_CHAIN_ID === '1' ? mainnet : goerli;

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
