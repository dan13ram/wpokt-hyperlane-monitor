import { Burn } from './burn';
import { InvalidMint } from './invalidMint';
import { Mint } from './mint';

export type MintData = {
  mints: Mint[];
  page: number;
  totalMints: number;
  totalPages: number;
};

export type BurnData = {
  burns: Burn[];
  page: number;
  totalBurns: number;
  totalPages: number;
};

export type InvalidMintData = {
  invalidMints: InvalidMint[];
  page: number;
  totalInvalidMints: number;
  totalPages: number;
};
