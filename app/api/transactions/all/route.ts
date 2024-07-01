import { NextRequest, NextResponse } from 'next/server';

import { getAllTransactions } from '@/lib/transaction';

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url);
  const page = Math.floor(Number(searchParams.get('page')));

  if (isNaN(page))
    return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });

  const transactions = await getAllTransactions(page);

  return NextResponse.json(transactions);
};
