import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { holesky, sepolia } from 'wagmi/chains';

import { WALLETCONNECT_PROJECT_ID } from '@/utils/constants';

export const projectId = WALLETCONNECT_PROJECT_ID;

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [sepolia, holesky] as const;
export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});
