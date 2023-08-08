if (!process.env.NEXT_PUBLIC_WRAPPED_POCKET_ADDRESS) {
  throw new Error(
    'Environment variable NEXT_PUBLIC_WRAPPED_POCKET_ADDRESS is not set',
  );
}

if (!process.env.NEXT_PUBLIC_MINT_CONTROLLER_ADDRESS) {
  throw new Error(
    'Environment variable NEXT_PUBLIC_MINT_CONTROLLER_ADDRESS is not set',
  );
}

if (!process.env.NEXT_PUBLIC_POKT_MULTISIG_ADDRESS) {
  throw new Error(
    'Environment variable NEXT_PUBLIC_POKT_MULTISIG_ADDRESS is not set',
  );
}

if (!process.env.NEXT_PUBLIC_POKT_CHAIN_ID) {
  throw new Error('Environment variable NEXT_PUBLIC_POKT_CHAIN_ID is not set');
}

if (!process.env.NEXT_PUBLIC_ETH_CHAIN_ID) {
  throw new Error('Environment variable NEXT_PUBLIC_ETH_CHAIN_ID is not set');
}

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error(
    'Environment variable NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set',
  );
}

export const WRAPPED_POCKET_ADDRESS =
  process.env.NEXT_PUBLIC_WRAPPED_POCKET_ADDRESS;
export const MINT_CONTROLLER_ADDRESS =
  process.env.NEXT_PUBLIC_MINT_CONTROLLER_ADDRESS;
export const POKT_MULTISIG_ADDRESS =
  process.env.NEXT_PUBLIC_POKT_MULTISIG_ADDRESS;
export const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;
export const POKT_CHAIN_ID = process.env.NEXT_PUBLIC_POKT_CHAIN_ID;
export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
