import { NextRequest, NextResponse } from 'next/server';

import { getTransactionFromId } from '@/lib/transaction';

type Params = {
  transactionId: string;
};

export const GET = async (
  _: NextRequest,
  context: { params: Params },
): Promise<NextResponse> => {
  const { transactionId } = context.params;

  if (typeof transactionId !== 'string' || !transactionId)
    return NextResponse.json(
      { error: 'Invalid transaction ID' },
      { status: 400 },
    );

  try {
    const transaction = getTransactionFromId(transactionId);

    if (!transaction)
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 },
      );

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error finding transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
};
