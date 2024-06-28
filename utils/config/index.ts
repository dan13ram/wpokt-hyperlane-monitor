import { Hex } from 'viem';

import { Config } from '@/types/config';

import { loadEnvConfig } from './env';
import { mergeConfigs } from './merge';
import { loadYamlConfig } from './yaml';

export const HyperlaneVersion = 3;

const initConfig = (): Config => {
  const yamlConfig = loadYamlConfig();
  const envConfig = loadEnvConfig();

  const mergeConfig = mergeConfigs(yamlConfig, envConfig);
  return mergeConfig;
};

export const config: Config = initConfig();

export const MailboxAddress = config.ethereum_networks[0]
  .mailbox_address as Hex;
export const WarpISMAddress = config.ethereum_networks[0]
  .warp_ism_address as Hex;
export const TokenAddress = config.ethereum_networks[0]
  .omni_token_address as Hex;
export const MintControllerAddress = config.ethereum_networks[0]
  .mint_controller_address as Hex;
