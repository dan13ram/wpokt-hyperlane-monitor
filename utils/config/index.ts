import { ChainInfo } from '@keplr-wallet/types';
import { Hex } from 'viem';

import { Config } from '@/types/config';

import { envConfig } from './env';
import { mergeConfigs } from './merge';
import { yamlConfig } from './yaml';

export const HyperlaneVersion = 3;

const mergedConfig: Config = mergeConfigs(yamlConfig, envConfig);

const cosmos_rpc_url = process.env.NEXT_PUBLIC_COSMOS_NETWORK_RPC_URL;
const sepolia_rpc_url = process.env.NEXT_PUBLIC_ETHEREUM_NETWORKS_0_RPC_URL;
const holesky_rpc_url = process.env.NEXT_PUBLIC_ETHEREUM_NETWORKS_1_RPC_URL;

if (!cosmos_rpc_url) {
  throw new Error('NEXT_PUBLIC_COSMOS_NETWORK_RPC_URL is not set');
}

if (!sepolia_rpc_url) {
  throw new Error('NEXT_PUBLIC_ETHEREUM_NETWORKS_0_RPC_URL is not set');
}

if (!holesky_rpc_url) {
  throw new Error('NEXT_PUBLIC_ETHEREUM_NETWORKS_1_RPC_URL is not set');
}

mergedConfig.cosmos_network.rpc_url = cosmos_rpc_url;
mergedConfig.ethereum_networks[0].rpc_url = sepolia_rpc_url;
mergedConfig.ethereum_networks[1].rpc_url = holesky_rpc_url;

export const config = mergedConfig;

export const poktChainInfo: ChainInfo = {
  rpc: config.cosmos_network.rpc_url,
  rest: '',
  chainId: config.cosmos_network.chain_id,
  chainName: config.cosmos_network.chain_name,
  stakeCurrency: {
    coinDenom: 'POKT',
    coinMinimalDenom: config.cosmos_network.coin_denom,
    coinDecimals: 6,
    coinGeckoId: 'pocket-network',
  },
  walletUrlForStaking: '',
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: config.cosmos_network.bech32_prefix,
    bech32PrefixAccPub: config.cosmos_network.bech32_prefix + 'pub',
    bech32PrefixValAddr: config.cosmos_network.bech32_prefix + 'valoper',
    bech32PrefixValPub: config.cosmos_network.bech32_prefix + 'valoperpub',
    bech32PrefixConsAddr: config.cosmos_network.bech32_prefix + 'valcons',
    bech32PrefixConsPub: config.cosmos_network.bech32_prefix + 'valconspub',
  },
  currencies: [
    {
      coinDenom: 'POKT',
      coinMinimalDenom: config.cosmos_network.coin_denom,
      coinDecimals: 6,
      coinGeckoId: 'pocket-network',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'POKT',
      coinMinimalDenom: config.cosmos_network.coin_denom,
      coinDecimals: 6,
      coinGeckoId: 'pocket-network',
      gasPriceStep: { low: 0, average: 0, high: 0 },
    },
  ],
  features: [],
};

// eslint-disable-next-line no-console
console.log({ poktChainInfo });

export const MailboxAddress = config.ethereum_networks[0]
  .mailbox_address as Hex;
export const WarpISMAddress = config.ethereum_networks[0]
  .warp_ism_address as Hex;
export const TokenAddress = config.ethereum_networks[0]
  .omni_token_address as Hex;
export const MintControllerAddress = config.ethereum_networks[0]
  .mint_controller_address as Hex;
