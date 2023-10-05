import { ObjectId } from 'mongodb';

import { dbPromise } from '@/lib/mongodb';
import { Burn, CollectionBurns } from '@/types';
import { WRAPPED_POCKET_ADDRESS } from '@/utils/constants';

import { PER_PAGE } from './constants';

export const getBurnFromId = async (id: string): Promise<Burn | null> => {
  try {
    const client = await dbPromise;

    const burn = await client.collection(CollectionBurns).findOne({
      _id: new ObjectId(id),
      wpokt_address: WRAPPED_POCKET_ADDRESS,
    });

    return burn as Burn | null;
  } catch (error) {
    console.error('Error finding burn:', error);
    return null;
  }
};

export const getAllBurns = async (_page: number): Promise<Burn[]> => {
  try {
    const page = Number.isNaN(_page) || !_page || _page < 1 ? 1 : _page;

    const client = await dbPromise;

    const burns = await client
      .collection(CollectionBurns)
      .find(
        {
          wpokt_address: WRAPPED_POCKET_ADDRESS,
        },
        { sort: { block_number: -1 } },
      )
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .toArray();

    return burns as Burn[];
  } catch (error) {
    console.error('Error finding burns:', error);
    return [];
  }
};

export const getTotalBurnAmount = async (): Promise<string> => {
  try {
    const client = await dbPromise;

    const totalBurnAmount = await client
      .collection(CollectionBurns)
      .aggregate([
        {
          $match: {
            status: 'success',
            wpokt_address: WRAPPED_POCKET_ADDRESS,
          },
        },
        {
          $group: {
            _id: null,
            totalBurnAmount: {
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

    return totalBurnAmount[0]?.totalBurnAmount?.toString() || '0';
  } catch (error) {
    console.error('Error finding total burn amount:', error);
    return '0';
  }
};
