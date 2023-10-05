import { NextApiRequest, NextApiResponse } from 'next';

import { getTotalMintAmount } from '@/lib/mint';

const findTotal = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end();

  const total = await getTotalMintAmount();

  return res.status(200).json(total);
};

export default findTotal;
