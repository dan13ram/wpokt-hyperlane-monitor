import { NextApiRequest, NextApiResponse } from 'next';

import { getTotalInvalidMintAmount } from '@/lib/invalidMint';

const findTotal = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end();

  const total = await getTotalInvalidMintAmount();

  return res.status(200).json(total);
};

export default findTotal;
