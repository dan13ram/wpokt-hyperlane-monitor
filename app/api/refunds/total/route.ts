import { NextResponse } from 'next/server';

import { getTotalRefundAmount } from '@/lib/refund';

export const GET = async (): Promise<NextResponse> => {
  const total = await getTotalRefundAmount();

  return NextResponse.json(total);
};
