import { NextRequest, NextResponse } from 'next/server';

import { getRefundFromId } from '@/lib/refund';

type Params = {
  refundId: string;
};

export const GET = async (
  _: NextRequest,
  context: { params: Params },
): Promise<NextResponse> => {
  const { refundId } = context.params;

  if (typeof refundId !== 'string' || !refundId)
    return NextResponse.json({ error: 'Invalid refund ID' }, { status: 400 });

  try {
    const refund = getRefundFromId(refundId);

    if (!refund)
      return NextResponse.json({ error: 'Refund not found' }, { status: 404 });

    return NextResponse.json(refund);
  } catch (error) {
    console.error('Error finding refund:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
};
