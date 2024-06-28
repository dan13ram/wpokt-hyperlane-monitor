import { Config } from '@/types/config';

import testnetConfig from './defaults/config.testnet.yml';
// import localConfig from '../defaults/config.local.yml';

export const HyperlaneVersion = 3;

export const loadYamlConfig = (): Config => testnetConfig as Config;
