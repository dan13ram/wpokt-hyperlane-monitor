import { ObjectId } from 'mongodb';

import { dbPromise } from '@/lib/mongodb';
import { CollectionInvalidMints, InvalidMint } from '@/types';
import { POKT_MULTISIG_ADDRESS } from '@/utils/constants';
import { PER_PAGE } from './constants';

export const getInvalidMintFromId = async (
  id: string,
): Promise<InvalidMint | null> => {
  try {
    const client = await dbPromise;

    const invalid_mint = await client
      .collection(CollectionInvalidMints)
      .findOne({ _id: new ObjectId(id), vault_address: POKT_MULTISIG_ADDRESS });

    return invalid_mint as InvalidMint | null;
  } catch (error) {
    console.error('Error finding invalid mint:', error);
    return null;
  }
};

export const getAllInvalidMints = async (
  _page: number,
): Promise<InvalidMint[]> => {
  try {
    const page = Number.isNaN(_page) || !_page || _page < 1 ? 1 : _page;

    const client = await dbPromise;

    const invalid_mints = await client
      .collection(CollectionInvalidMints)
      .find(
        {
          vault_address: POKT_MULTISIG_ADDRESS,
        },
        { sort: { height: -1 } },
      )
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .toArray();

    return invalid_mints as InvalidMint[];
  } catch (error) {
    console.error('Error finding invalid mints:', error);
    return [];
  }
};

export const getTotalInvalidMintAmount = async (): Promise<string> => {
  try {
    const client = await dbPromise;

    const totalInvalidMintAmount = await client
      .collection(CollectionInvalidMints)
      .aggregate([
        {
          $match: {
            status: 'success',
            vault_address: POKT_MULTISIG_ADDRESS,
          },
        },
        {
          $group: {
            _id: null,
            totalInvalidMintAmount: {
              $sum: {
                $convert: {
                  input: {
                    $toLong: '$amount',
                  },
                  to: 'decimal',
                },
              },
            },
          },
        },
      ])
      .toArray();

    return totalInvalidMintAmount[0]?.totalInvalidMintAmount?.toString() || '0';
  } catch (error) {
    console.error('Error finding total invalid mint amount:', error);
    return '0';
  }
};
