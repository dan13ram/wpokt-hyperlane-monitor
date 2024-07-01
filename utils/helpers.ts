import { CosmosNetworkConfig, EthereumNetworkConfig } from '@/types/config';

import { config } from './config';
import { COSMOS_CHAIN_DOMAIN } from './cosmos';

export const shortenHex = (hex: string, maxChars: number = 10): string => {
  if (!hex) return '';
  if (hex.length <= maxChars + 2) return hex;
  return `${hex.slice(0, maxChars - 4)}…${hex.slice(-4)}`;
};

export const uniqueValues = (array: string[]): string[] => {
  const map: Record<string, boolean> = {};
  array.forEach(item => {
    map[item] = true;
  });
  return Object.keys(map);
};

export const humanFormattedDate = (date: Date | string | number): string => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

export const getTxLink = (chainId: string, txHash: string): string => {
  switch (chainId) {
    case '1':
      return `https://etherscan.io/tx/${txHash}`;
    case '5':
      return `https://goerli.etherscan.io/tx/${txHash}`;
    case '11155111':
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    case '17000':
      return `https://holesky.etherscan.io/tx/${txHash}`;
    case '31337':
    default:
      return ``;
  }
};

export const getAddressLink = (chainId: string, address: string): string => {
  switch (chainId) {
    case '1':
      return `https://etherscan.io/address/${address}`;
    case '5':
      return `https://goerli.etherscan.io/address/${address}`;
    case '11155111':
      return `https://sepolia.etherscan.io/address/${address}`;
    case '17000':
      return `https://holesky.etherscan.io/address/${address}`;
    case '31337':
    default:
      return ``;
  }
};

export type NetworkConfig = CosmosNetworkConfig | EthereumNetworkConfig;

const networkConfigs: Record<string, NetworkConfig> = {
  [config.cosmos_network.chain_id]: config.cosmos_network,
  [COSMOS_CHAIN_DOMAIN.toString()]: config.cosmos_network,
  ...config.ethereum_networks.reduce<Record<string, EthereumNetworkConfig>>(
    (acc, network) => {
      acc[network.chain_id.toString()] = network;
      return acc;
    },
    {},
  ),
};

export const getNetworkConfig = (chainId: string): NetworkConfig =>
  networkConfigs[chainId];

export const sleep = async (timeoutMs: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, timeoutMs));
};
