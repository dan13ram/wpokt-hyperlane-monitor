import { NextResponse } from 'next/server';

import { getTotalMessageAmount } from '@/lib/message';

export const GET = async (): Promise<NextResponse> => {
  const total = await getTotalMessageAmount();

  return NextResponse.json(total);
};
