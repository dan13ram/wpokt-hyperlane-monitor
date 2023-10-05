import { NextApiRequest, NextApiResponse } from 'next';

import { getTotalBurnAmount } from '@/lib/burn';

const findTotal = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end();

  const total = await getTotalBurnAmount();

  return res.status(200).json(total);
};

export default findTotal;
