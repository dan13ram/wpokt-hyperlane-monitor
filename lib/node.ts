import { dbPromise } from '@/lib/mongodb';
import { CollectionNodes, Node } from '@/types';

export const getAllNodes = async (): Promise<Node[]> => {
  try {
    const client = await dbPromise;

    const nodes = await client
      .collection(CollectionNodes)
      .find({}, { sort: { oracle_id: 1 } })
      .toArray();

    return nodes as Node[];
  } catch (error) {
    console.error('Error finding nodes:', error);
    return [];
  }
};
