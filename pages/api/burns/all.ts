import { NextApiRequest, NextApiResponse } from 'next';

import { getAllBurns } from '@/lib/burn';

const findAll = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end();

  const page = Math.floor(Number(req.query.page));

  if (isNaN(page)) return res.status(400).end();

  const burns = await getAllBurns(page);

  return res.status(200).json(burns);
};

export default findAll;
