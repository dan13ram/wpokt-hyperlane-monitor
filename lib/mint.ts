import { ObjectId } from 'mongodb';

import { dbPromise } from '@/lib/mongodb';
import { Mint } from '@/types';

const MINTS_COLLECTION = 'mints';

export const getMintFromId = async (id: string): Promise<Mint | null> => {
  try {
    const client = await dbPromise;

    const mint = await client
      .collection(MINTS_COLLECTION)
      .findOne({ _id: new ObjectId(id) });

    return mint as Mint | null;
  } catch (error) {
    console.error('Error finding mint:', error);
    return null;
  }
};

export const getAllMints = async (): Promise<Mint[]> => {
  try {
    const client = await dbPromise;

    const mints = await client
      .collection(MINTS_COLLECTION)
      .find({}, { sort: { created_at: -1 } })
      .toArray();

    return mints as Mint[];
  } catch (error) {
    console.error('Error finding mints:', error);
    return [];
  }
};
