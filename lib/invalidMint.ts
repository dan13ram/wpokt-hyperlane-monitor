import { ObjectId } from 'mongodb';

import { dbPromise } from '@/lib/mongodb';
import { InvalidMint } from '@/types';

const INVALID_MINTS_COLLECTION = 'invalid_mints';

export const getInvalidMintFromId = async (
  id: string,
): Promise<InvalidMint | null> => {
  try {
    const client = await dbPromise;

    const invalid_mint = await client
      .collection(INVALID_MINTS_COLLECTION)
      .findOne({ _id: new ObjectId(id) });

    return invalid_mint as InvalidMint | null;
  } catch (error) {
    console.error('Error finding invalid mint:', error);
    return null;
  }
};

export const getAllInvalidMints = async (): Promise<InvalidMint[]> => {
  try {
    const client = await dbPromise;

    const invalid_mints = await client
      .collection(INVALID_MINTS_COLLECTION)
      .find({}, { sort: { created_at: -1 } })
      .toArray();

    return invalid_mints as InvalidMint[];
  } catch (error) {
    console.error('Error finding invalid mints:', error);
    return [];
  }
};
