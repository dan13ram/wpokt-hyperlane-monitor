import { ObjectId } from 'mongodb';

import { dbPromise } from '@/lib/mongodb';
import { CollectionMints, Mint } from '@/types';
import {
  POKT_MULTISIG_ADDRESS,
  WRAPPED_POCKET_ADDRESS,
} from '@/utils/constants';

import { PER_PAGE } from './constants';

export const getMintFromId = async (id: string): Promise<Mint | null> => {
  try {
    const client = await dbPromise;

    const mint = await client.collection(CollectionMints).findOne({
      _id: new ObjectId(id),
      wpokt_address: WRAPPED_POCKET_ADDRESS,
      vault_address: POKT_MULTISIG_ADDRESS,
    });

    return mint as Mint | null;
  } catch (error) {
    console.error('Error finding mint:', error);
    return null;
  }
};

export const getAllMints = async (_page: number): Promise<Mint[]> => {
  try {
    const page = Number.isNaN(_page) || !_page || _page < 1 ? 1 : _page;

    const client = await dbPromise;

    const mints = await client
      .collection(CollectionMints)
      .find(
        {
          wpokt_address: WRAPPED_POCKET_ADDRESS,
          vault_address: POKT_MULTISIG_ADDRESS,
        },
        { sort: { height: -1 } },
      )
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .toArray();

    return mints as Mint[];
  } catch (error) {
    console.error('Error finding mints:', error);
    return [];
  }
};

export const getTotalMintAmount = async (): Promise<string> => {
  try {
    const client = await dbPromise;

    const totalMintAmount = await client
      .collection(CollectionMints)
      .aggregate([
        {
          $match: {
            status: 'success',
            wpokt_address: WRAPPED_POCKET_ADDRESS,
            vault_address: POKT_MULTISIG_ADDRESS,
          },
        },
        {
          $group: {
            _id: null,
            totalMintAmount: {
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

    return totalMintAmount[0]?.totalMintAmount?.toString() || '0';
  } catch (error) {
    console.error('Error finding total mint amount:', error);
    return '0';
  }
};
