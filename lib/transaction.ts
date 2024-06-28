import { ObjectId } from 'mongodb';

import { dbPromise } from '@/lib/mongodb';
import { CollectionTransactions, Transaction, TransactionData } from '@/types';

import { PER_PAGE } from './constants';

export const getTransactionFromId = async (
  id: string,
): Promise<Transaction | null> => {
  try {
    const client = await dbPromise;

    const transaction = await client
      .collection(CollectionTransactions)
      .findOne({
        _id: new ObjectId(id),
      });

    return transaction as Transaction | null;
  } catch (error) {
    console.error('Error finding transaction:', error);
    return null;
  }
};

export const getAllTransactions = async (
  _page: number,
): Promise<TransactionData> => {
  const page = Number.isNaN(_page) || !_page || _page < 1 ? 1 : _page;

  try {
    const client = await dbPromise;

    const transactions = await client
      .collection(CollectionTransactions)
      .find({}, { sort: { height: -1 } })
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .toArray();

    const totalTransactions = await client
      .collection(CollectionTransactions)
      .countDocuments({});

    const totalPages = Math.ceil(totalTransactions / PER_PAGE);

    const data = {
      transactions,
      page,
      totalTransactions,
      totalPages,
    };

    return data as TransactionData;
  } catch (error) {
    console.error('Error finding transactions:', error);
    return {
      transactions: [],
      page,
      totalTransactions: 0,
      totalPages: 0,
    };
  }
};
