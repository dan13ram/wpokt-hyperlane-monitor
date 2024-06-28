import { NextResponse } from 'next/server';

import { getTotalMessageAmount } from '@/lib/message';
import { getTotalRefundAmount } from '@/lib/refund';

export const GET = async (): Promise<NextResponse> => {
  const totalMessageAmount = await getTotalMessageAmount();
  const totalRefundAmount = await getTotalRefundAmount();

  const totals = {
    messages: totalMessageAmount,
    refunds: totalRefundAmount,
  };

  return NextResponse.json(totals);
};
