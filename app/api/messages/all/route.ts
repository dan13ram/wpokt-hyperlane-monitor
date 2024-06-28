import { NextRequest, NextResponse } from 'next/server';

import { getAllMessages } from '@/lib/message';

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

  const messages = await getAllMessages(page);

  return NextResponse.json(messages);
};
