import { NextRequest, NextResponse } from 'next/server';

import { getAllMessages } from '@/lib/message';

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url);
  const page = Math.floor(Number(searchParams.get('page')));

  if (isNaN(page))
    return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });

  const messages = await getAllMessages(page);

  return NextResponse.json(messages);
};
