import { NextRequest, NextResponse } from 'next/server';

import { getMessageFromId } from '@/lib/message';

type Params = {
  messageId: string;
};

export const GET = async (
  _: NextRequest,
  context: { params: Params },
): Promise<NextResponse> => {
  const { messageId } = context.params;

  if (typeof messageId !== 'string' || !messageId)
    return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 });

  try {
    const message = getMessageFromId(messageId);

    if (!message)
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error finding message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
};
