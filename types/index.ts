import { WithId } from 'mongodb';

export type Maybe<T> = T | null | undefined;

export enum Status {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SIGNED = 'signed',
  SUMBITTED = 'submitted',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export type MintMemo = {
  address: string;
  chain_id: string;
};

export type MintData = {
  recipient: string;
  amount: string;
  nonce: string;
};

export type Mint = WithId<{
  transaction_hash: string;
  height: string;
  sender_address: string;
  sender_chain_id: string;
  recipient_address: string;
  recipient_chain_id: string;
  amount: string;
  created_at: Date;
  updated_at: Date;
  status: Status;
  data: Maybe<MintData>;
  signers: string[];
  signatures: string[];
  mint_tx_hash: string;
}>;

export type Burn = WithId<{
  transaction_hash: string;
  log_index: string;
  block_number: string;
  sender_address: string;
  sender_chain_id: string;
  recipient_address: string;
  recipient_chain_id: string;
  amount: string;
  created_at: Date;
  updated_at: Date;
  status: Status;
  return_tx: string;
  signers: string[];
  return_tx_hash: string;
}>;

export type InvalidMint = WithId<{
  transaction_hash: string;
  height: string;
  sender_address: string;
  sender_chain_id: string;
  amount: string;
  created_at: Date;
  updated_at: Date;
  status: Status;
  return_tx: string;
  signers: string[];
  return_tx_hash: string;
}>;
