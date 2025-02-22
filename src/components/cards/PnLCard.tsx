import { useLastResolved } from 'ccstate-react';
import { SkeletonCard } from './SkeletonCard';
import { pnl$ } from '../../atoms/portfolio';
import { Amount } from './Amount';
import { Card } from './Card';

export function PnLCard() {
  const pnl = useLastResolved(pnl$);

  if (!pnl) {
    return <SkeletonCard />;
  }

  const totalPnL = pnl.realizedPnlExFee + pnl.unrealizedPnl + pnl.dividendExTax;
  const isPositive = totalPnL >= 0;

  return (
    <Card
      title="PnL"
      mainValue={<Amount value={totalPnL} currency={pnl.currency} showFlag="both" />}
      subValue={
        <>
          Dividends <Amount value={pnl.dividendExTax} />
        </>
      }
      isPositive={isPositive}
    />
  );
}
