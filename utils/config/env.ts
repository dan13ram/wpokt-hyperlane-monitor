import { Config } from '@/types/config';

const getUint64Env = (key: string): number => {
  const valStr = process.env[key];
  return valStr ? parseInt(valStr, 10) : 0;
};

const getBoolEnv = (key: string): boolean => {
  const valStr = process.env[key];
  return valStr ? valStr.toLowerCase() === 'true' : false;
};

const getStringEnv = (key: string): string => {
  const val = process.env[key];
  return val ? val : '';
};

const getStringArrayEnv = (key: string): string[] => {
  const val = process.env[key];
  return val ? val.split(',') : [];
};

const getArrayLengthEnv = (key: string): number => {
  const env = Object.keys(process.env);
  const seen: Record<number, boolean> = {};
  let length = 0;

  env.forEach(e => {
    if (e.startsWith(key)) {
      const vals = e.substring(key.length).split('_');
      const val = parseInt(vals[1], 10);
      if (!isNaN(val) && !seen[val]) {
        length++;
        seen[val] = true;
      }
    }
  });

  return length;
};

const config: Config = {
  mnemonic: '', //getStringEnv('MNEMONIC'),
  health_check: {
    interval_ms: getUint64Env('NEXT_PUBLIC_HEALTH_CHECK_INTERVAL_MS'),
    read_last_health: getBoolEnv('NEXT_PUBLIC_HEALTH_CHECK_READ_LAST_HEALTH'),
  },
  logger: {
    level: getStringEnv('NEXT_PUBLIC_LOGGER_LEVEL'),
    format: getStringEnv('NEXT_PUBLIC_LOGGER_FORMAT'),
  },
  mongodb: {
    uri: '', // getStringEnv('MONGODB_URI'),
    database: '', // getStringEnv('MONGODB_DATABASE'),
    timeout_ms: 0, // getUint64Env('MONGODB_TIMEOUT_MS'),
  },
  ethereum_networks: [],
  cosmos_network: {
    start_block_height: getUint64Env(
      'NEXT_PUBLIC_COSMOS_NETWORK_START_BLOCK_HEIGHT',
    ),
    confirmations: getUint64Env('NEXT_PUBLIC_COSMOS_NETWORK_CONFIRMATIONS'),
    rpc_url: getStringEnv('NEXT_PUBLIC_COSMOS_NETWORK_RPC_URL'),
    grpc_enabled: getBoolEnv('NEXT_PUBLIC_COSMOS_NETWORK_GRPC_ENABLED'),
    grpc_host: getStringEnv('NEXT_PUBLIC_COSMOS_NETWORK_GRPC_HOST'),
    grpc_port: getUint64Env('NEXT_PUBLIC_COSMOS_NETWORK_GRPC_PORT'),
    timeout_ms: getUint64Env('NEXT_PUBLIC_COSMOS_NETWORK_TIMEOUT_MS'),
    chain_id: getStringEnv('NEXT_PUBLIC_COSMOS_NETWORK_CHAIN_ID'),
    chain_name: getStringEnv('NEXT_PUBLIC_COSMOS_NETWORK_CHAIN_NAME'),
    tx_fee: getUint64Env('NEXT_PUBLIC_COSMOS_NETWORK_TX_FEE'),
    bech32_prefix: getStringEnv('NEXT_PUBLIC_COSMOS_NETWORK_BECH32_PREFIX'),
    coin_denom: getStringEnv('NEXT_PUBLIC_COSMOS_NETWORK_COIN_DENOM'),
    multisig_address: getStringEnv(
      'NEXT_PUBLIC_COSMOS_NETWORK_MULTISIG_ADDRESS',
    ),
    multisig_public_keys: getStringArrayEnv(
      'NEXT_PUBLIC_COSMOS_NETWORK_MULTISIG_PUBLIC_KEYS',
    ),
    multisig_threshold: getUint64Env(
      'NEXT_PUBLIC_COSMOS_NETWORK_MULTISIG_THRESHOLD',
    ),
    message_monitor: {
      enabled: getBoolEnv('NEXT_PUBLIC_COSMOS_NETWORK_MESSAGE_MONITOR_ENABLED'),
      interval_ms: getUint64Env(
        'NEXT_PUBLIC_COSMOS_NETWORK_MESSAGE_MONITOR_INTERVAL_MS',
      ),
    },
    message_signer: {
      enabled: getBoolEnv('NEXT_PUBLIC_COSMOS_NETWORK_MESSAGE_SIGNER_ENABLED'),
      interval_ms: getUint64Env(
        'NEXT_PUBLIC_COSMOS_NETWORK_MESSAGE_SIGNER_INTERVAL_MS',
      ),
    },
    message_relayer: {
      enabled: getBoolEnv('NEXT_PUBLIC_COSMOS_NETWORK_MESSAGE_RELAYER_ENABLED'),
      interval_ms: getUint64Env(
        'NEXT_PUBLIC_COSMOS_NETWORK_MESSAGE_RELAYER_INTERVAL_MS',
      ),
    },
  },
};

const numEthereumNetworksEnv = getUint64Env(
  'NEXT_PUBLIC_NUM_ETHEREUM_NETWORKS',
);
const numEthereumNetworks = getArrayLengthEnv('NEXT_PUBLIC_ETHEREUM_NETWORKS');

if (numEthereumNetworks !== numEthereumNetworksEnv) {
  throw new Error('Number of Ethereum networks does not match');
}

for (let i = 0; i < numEthereumNetworks; i++) {
  config.ethereum_networks.push({
    start_block_height: getUint64Env(
      `NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_START_BLOCK_HEIGHT`,
    ),
    confirmations: getUint64Env(
      `NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_CONFIRMATIONS`,
    ),
    rpc_url: getStringEnv(`NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_RPC_URL`),
    timeout_ms: getUint64Env(`NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_TIMEOUT_MS`),
    chain_id: getUint64Env(`NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_CHAIN_ID`),
    chain_name: getStringEnv(`NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_CHAIN_NAME`),
    mailbox_address: getStringEnv(
      `NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_MAILBOX_ADDRESS`,
    ),
    mint_controller_address: getStringEnv(
      `NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_MINT_CONTROLLER_ADDRESS`,
    ),
    omni_token_address: getStringEnv(
      `NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_OMNI_TOKEN_ADDRESS`,
    ),
    warp_ism_address: getStringEnv(
      `NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_WARP_ISM_ADDRESS`,
    ),
    oracle_addresses: getStringArrayEnv(
      `NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_ORACLE_ADDRESSES`,
    ),
    message_monitor: {
      enabled: getBoolEnv(
        `NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_MESSAGE_MONITOR_ENABLED`,
      ),
      interval_ms: getUint64Env(
        `NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_MESSAGE_MONITOR_INTERVAL_MS`,
      ),
    },
    message_signer: {
      enabled: getBoolEnv(
        `NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_MESSAGE_SIGNER_ENABLED`,
      ),
      interval_ms: getUint64Env(
        `NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_MESSAGE_SIGNER_INTERVAL_MS`,
      ),
    },
    message_relayer: {
      enabled: getBoolEnv(
        `NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_MESSAGE_RELAYER_ENABLED`,
      ),
      interval_ms: getUint64Env(
        `NEXT_PUBLIC_ETHEREUM_NETWORKS_${i}_MESSAGE_RELAYER_INTERVAL_MS`,
      ),
    },
  });
}

export const envConfig = config;
