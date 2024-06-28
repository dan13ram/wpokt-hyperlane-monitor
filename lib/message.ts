import { ObjectId } from 'mongodb';

import { dbPromise } from '@/lib/mongodb';
import { CollectionMessages, Message, MessageData } from '@/types';

import { PER_PAGE } from './constants';

export const getMessageFromId = async (id: string): Promise<Message | null> => {
  try {
    const client = await dbPromise;

    const message = await client.collection(CollectionMessages).findOne({
      _id: new ObjectId(id),
    });

    return message as Message | null;
  } catch (error) {
    console.error('Error finding message:', error);
    return null;
  }
};

export const getAllMessages = async (_page: number): Promise<MessageData> => {
  const page = Number.isNaN(_page) || !_page || _page < 1 ? 1 : _page;

  try {
    const client = await dbPromise;

    const messages = await client
      .collection(CollectionMessages)
      .find({}, { sort: { height: -1 } })
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .toArray();

    const totalMessages = await client
      .collection(CollectionMessages)
      .countDocuments({});

    const totalPages = Math.ceil(totalMessages / PER_PAGE);

    const data = {
      messages,
      page,
      totalMessages,
      totalPages,
    };

    return data as MessageData;
  } catch (error) {
    console.error('Error finding messages:', error);
    return {
      messages: [],
      page,
      totalMessages: 0,
      totalPages: 0,
    };
  }
};

export const getTotalMessageAmount = async (): Promise<string> => {
  try {
    const client = await dbPromise;

    const totalMessageAmount = await client
      .collection(CollectionMessages)
      .aggregate([
        {
          $match: {
            status: 'success',
          },
        },
        {
          $group: {
            _id: null,
            totalMessageAmount: {
              $sum: {
                $convert: {
                  input: {
                    $toLong: '$content.message_body.amount',
                  },
                  to: 'decimal',
                },
              },
            },
          },
        },
      ])
      .toArray();

    return totalMessageAmount[0]?.totalMessageAmount?.toString() || '0';
  } catch (error) {
    console.error('Error finding total message amount:', error);
    return '0';
  }
};
