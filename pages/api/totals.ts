import { NextApiRequest, NextApiResponse } from 'next';

import { getTotalBurnAmount } from '@/lib/burn';
import { getTotalInvalidMintAmount } from '@/lib/invalidMint';
import { getTotalMintAmount } from '@/lib/mint';

const findTotals = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end();

  const totalMintAmount = await getTotalMintAmount();
  const totalBurnAmount = await getTotalBurnAmount();
  const totalInvalidMintAmount = await getTotalInvalidMintAmount();

  const totals = {
    mints: totalMintAmount,
    burns: totalBurnAmount,
    invalidMints: totalInvalidMintAmount,
  };

  return res.status(200).json(totals);
};

export default findTotals;
