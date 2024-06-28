import { NextRequest, NextResponse } from 'next/server';

import { getAllRefunds } from '@/lib/refund';

type Params = {
  page: string;
};

export const GET = async (
  _: NextRequest,
  context: { params: Params },
): Promise<NextResponse> => {
  const page = Math.floor(Number(context.params.page));

  if (isNaN(page))
    return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });

  const refunds = await getAllRefunds(page);

  return NextResponse.json(refunds);
};
