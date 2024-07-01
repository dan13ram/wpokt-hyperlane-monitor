import { Config } from '@/types/config';

// Function to merge two Config objects, prioritizing non-empty configurations from the envConfig
export const mergeConfigs = (yamlConfig: Config, envConfig: Config): Config => {
  // Create a new Config instance to store the merged values
  const mergedConfig: Config = { ...yamlConfig };

  // Merge HealthCheck
  if (envConfig.health_check.interval_ms) {
    mergedConfig.health_check.interval_ms = envConfig.health_check.interval_ms;
  }
  if (envConfig.health_check.read_last_health) {
    mergedConfig.health_check.read_last_health =
      envConfig.health_check.read_last_health;
  }

  // Merge Logger
  if (envConfig.logger.level) {
    mergedConfig.logger.level = envConfig.logger.level;
  }
  if (envConfig.logger.format) {
    mergedConfig.logger.format = envConfig.logger.format;
  }

  // Merge MongoDB
  if (envConfig.mongodb.uri) {
    mergedConfig.mongodb.uri = envConfig.mongodb.uri;
  }
  if (envConfig.mongodb.database) {
    mergedConfig.mongodb.database = envConfig.mongodb.database;
  }
  if (envConfig.mongodb.timeout_ms) {
    mergedConfig.mongodb.timeout_ms = envConfig.mongodb.timeout_ms;
  }

  if (envConfig.mnemonic) {
    mergedConfig.mnemonic = envConfig.mnemonic;
  }

  // Merge EthereumNetworks
  envConfig.ethereum_networks.forEach((envEthNet, i: number) => {
    if (i < mergedConfig.ethereum_networks.length) {
      if (envEthNet.start_block_height) {
        mergedConfig.ethereum_networks[i].start_block_height =
          envEthNet.start_block_height;
      }
      if (envEthNet.confirmations) {
        mergedConfig.ethereum_networks[i].confirmations =
          envEthNet.confirmations;
      }
      if (envEthNet.rpc_url) {
        mergedConfig.ethereum_networks[i].rpc_url = envEthNet.rpc_url;
      }
      if (envEthNet.timeout_ms) {
        mergedConfig.ethereum_networks[i].timeout_ms = envEthNet.timeout_ms;
      }
      if (envEthNet.chain_id) {
        mergedConfig.ethereum_networks[i].chain_id = envEthNet.chain_id;
      }
      if (envEthNet.chain_name) {
        mergedConfig.ethereum_networks[i].chain_name = envEthNet.chain_name;
      }
      if (envEthNet.mailbox_address) {
        mergedConfig.ethereum_networks[i].mailbox_address =
          envEthNet.mailbox_address;
      }
      if (envEthNet.mint_controller_address) {
        mergedConfig.ethereum_networks[i].mint_controller_address =
          envEthNet.mint_controller_address;
      }
      if (envEthNet.omni_token_address) {
        mergedConfig.ethereum_networks[i].omni_token_address =
          envEthNet.omni_token_address;
      }
      if (envEthNet.warp_ism_address) {
        mergedConfig.ethereum_networks[i].warp_ism_address =
          envEthNet.warp_ism_address;
      }
      if (envEthNet.oracle_addresses.length) {
        mergedConfig.ethereum_networks[i].oracle_addresses =
          envEthNet.oracle_addresses;
      }
      if (envEthNet.message_monitor.enabled) {
        mergedConfig.ethereum_networks[i].message_monitor.enabled =
          envEthNet.message_monitor.enabled;
      }
      if (envEthNet.message_monitor.interval_ms) {
        mergedConfig.ethereum_networks[i].message_monitor.interval_ms =
          envEthNet.message_monitor.interval_ms;
      }
      if (envEthNet.message_signer.enabled) {
        mergedConfig.ethereum_networks[i].message_signer.enabled =
          envEthNet.message_signer.enabled;
      }
      if (envEthNet.message_signer.interval_ms) {
        mergedConfig.ethereum_networks[i].message_signer.interval_ms =
          envEthNet.message_signer.interval_ms;
      }
      if (envEthNet.message_relayer.enabled) {
        mergedConfig.ethereum_networks[i].message_relayer.enabled =
          envEthNet.message_relayer.enabled;
      }
      if (envEthNet.message_relayer.interval_ms) {
        mergedConfig.ethereum_networks[i].message_relayer.interval_ms =
          envEthNet.message_relayer.interval_ms;
      }
    } else {
      mergedConfig.ethereum_networks.push(envEthNet);
    }
  });

  // Merge CosmosNetwork
  if (envConfig.cosmos_network.start_block_height) {
    mergedConfig.cosmos_network.start_block_height =
      envConfig.cosmos_network.start_block_height;
  }
  if (envConfig.cosmos_network.confirmations) {
    mergedConfig.cosmos_network.confirmations =
      envConfig.cosmos_network.confirmations;
  }

  if (envConfig.cosmos_network.rpc_url) {
    mergedConfig.cosmos_network.rpc_url = envConfig.cosmos_network.rpc_url;
  }
  if (envConfig.cosmos_network.grpc_enabled) {
    mergedConfig.cosmos_network.grpc_enabled =
      envConfig.cosmos_network.grpc_enabled;
  }
  if (envConfig.cosmos_network.grpc_host) {
    mergedConfig.cosmos_network.grpc_host = envConfig.cosmos_network.grpc_host;
  }
  if (envConfig.cosmos_network.grpc_port) {
    mergedConfig.cosmos_network.grpc_port = envConfig.cosmos_network.grpc_port;
  }
  if (envConfig.cosmos_network.timeout_ms) {
    mergedConfig.cosmos_network.timeout_ms =
      envConfig.cosmos_network.timeout_ms;
  }
  if (envConfig.cosmos_network.chain_id) {
    mergedConfig.cosmos_network.chain_id = envConfig.cosmos_network.chain_id;
  }
  if (envConfig.cosmos_network.chain_name) {
    mergedConfig.cosmos_network.chain_name =
      envConfig.cosmos_network.chain_name;
  }
  if (envConfig.cosmos_network.tx_fee) {
    mergedConfig.cosmos_network.tx_fee = envConfig.cosmos_network.tx_fee;
  }
  if (envConfig.cosmos_network.bech32_prefix) {
    mergedConfig.cosmos_network.bech32_prefix =
      envConfig.cosmos_network.bech32_prefix;
  }
  if (envConfig.cosmos_network.coin_denom) {
    mergedConfig.cosmos_network.coin_denom =
      envConfig.cosmos_network.coin_denom;
  }
  if (envConfig.cosmos_network.multisig_address) {
    mergedConfig.cosmos_network.multisig_address =
      envConfig.cosmos_network.multisig_address;
  }
  if (envConfig.cosmos_network.multisig_public_keys.length) {
    mergedConfig.cosmos_network.multisig_public_keys =
      envConfig.cosmos_network.multisig_public_keys;
  }
  if (envConfig.cosmos_network.multisig_threshold) {
    mergedConfig.cosmos_network.multisig_threshold =
      envConfig.cosmos_network.multisig_threshold;
  }
  if (envConfig.cosmos_network.message_monitor.enabled) {
    mergedConfig.cosmos_network.message_monitor.enabled =
      envConfig.cosmos_network.message_monitor.enabled;
  }
  if (envConfig.cosmos_network.message_monitor.interval_ms) {
    mergedConfig.cosmos_network.message_monitor.interval_ms =
      envConfig.cosmos_network.message_monitor.interval_ms;
  }
  if (envConfig.cosmos_network.message_signer.enabled) {
    mergedConfig.cosmos_network.message_signer.enabled =
      envConfig.cosmos_network.message_signer.enabled;
  }
  if (envConfig.cosmos_network.message_signer.interval_ms) {
    mergedConfig.cosmos_network.message_signer.interval_ms =
      envConfig.cosmos_network.message_signer.interval_ms;
  }
  if (envConfig.cosmos_network.message_relayer.enabled) {
    mergedConfig.cosmos_network.message_relayer.enabled =
      envConfig.cosmos_network.message_relayer.enabled;
  }
  if (envConfig.cosmos_network.message_relayer.interval_ms) {
    mergedConfig.cosmos_network.message_relayer.interval_ms =
      envConfig.cosmos_network.message_relayer.interval_ms;
  }

  return mergedConfig;
};
