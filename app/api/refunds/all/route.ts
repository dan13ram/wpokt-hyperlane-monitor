import { NextRequest, NextResponse } from 'next/server';

import { getAllRefunds } from '@/lib/refund';

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url);
  const page = Math.floor(Number(searchParams.get('page')));

  if (isNaN(page))
    return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });

  const refunds = await getAllRefunds(page);

  return NextResponse.json(refunds);
};
