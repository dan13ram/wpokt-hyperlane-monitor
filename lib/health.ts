import { dbPromise } from '@/lib/mongodb';
import { CollectionHealthChecks, Health } from '@/types';

export const getAllHealths = async (): Promise<Health[]> => {
  try {
    const client = await dbPromise;

    // get unique healths where hostname is unique and created_at is the latest
    const healths = await client
      .collection(CollectionHealthChecks)
      .aggregate([
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $group: {
            _id: '$hostname',
            health: {
              $first: '$$ROOT',
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: '$health',
          },
        },
        {
          $sort: {
            hostname: 1,
          },
        },
      ])
      .toArray();

    return healths as Health[];
  } catch (error) {
    console.error('Error finding healths:', error);
    return [];
  }
};
