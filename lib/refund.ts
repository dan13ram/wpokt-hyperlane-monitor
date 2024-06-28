import { ObjectId } from 'mongodb';

import { dbPromise } from '@/lib/mongodb';
import { CollectionRefunds, Refund, RefundData } from '@/types';

import { PER_PAGE } from './constants';

export const getRefundFromId = async (id: string): Promise<Refund | null> => {
  try {
    const client = await dbPromise;

    const refund = await client.collection(CollectionRefunds).findOne({
      _id: new ObjectId(id),
    });

    return refund as Refund | null;
  } catch (error) {
    console.error('Error finding refund:', error);
    return null;
  }
};

export const getAllRefunds = async (_page: number): Promise<RefundData> => {
  const page = Number.isNaN(_page) || !_page || _page < 1 ? 1 : _page;

  try {
    const client = await dbPromise;

    const refunds = await client
      .collection(CollectionRefunds)
      .find({}, { sort: { height: -1 } })
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .toArray();

    const totalRefunds = await client
      .collection(CollectionRefunds)
      .countDocuments({});

    const totalPages = Math.ceil(totalRefunds / PER_PAGE);

    const data = {
      refunds,
      page,
      totalRefunds,
      totalPages,
    };

    return data as RefundData;
  } catch (error) {
    console.error('Error finding refunds:', error);
    return {
      refunds: [],
      page,
      totalRefunds: 0,
      totalPages: 0,
    };
  }
};

export const getTotalRefundAmount = async (): Promise<string> => {
  try {
    const client = await dbPromise;

    const totalRefundAmount = await client
      .collection(CollectionRefunds)
      .aggregate([
        {
          $match: {
            status: 'success',
          },
        },
        {
          $group: {
            _id: null,
            totalRefundAmount: {
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

    return totalRefundAmount[0]?.totalRefundAmount?.toString() || '0';
  } catch (error) {
    console.error('Error finding total refund amount:', error);
    return '0';
  }
};
