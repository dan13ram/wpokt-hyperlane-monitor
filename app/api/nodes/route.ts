import { NextResponse } from 'next/server';

import { getAllNodes } from '@/lib/node';

export const GET = async (): Promise<NextResponse> => {
  const nodes = await getAllNodes();

  return NextResponse.json(nodes);
};
