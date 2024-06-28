'use client';

import { formatUnits } from 'viem';

import { Tile } from '@/components/Tile';
import useTotals from '@/hooks/useTotals';

export const TotalsTile: React.FC = () => {
  const { totals, loading } = useTotals();

  return (
    <Tile
      entries={[
        {
          label: 'Total Messages Amount',
          value: loading ? '…' : formatUnits(totals.messages, 6),
        },
        {
          label: 'Total Refund Amount',
          value: loading ? '…' : formatUnits(totals.refunds, 6),
        },
      ]}
    />
  );
};
