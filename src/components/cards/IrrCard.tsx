import { useLastResolved } from 'ccstate-react';
import { irrSummary$ } from '../../atoms/portfolio';
import { SkeletonCard } from './SkeletonCard';
import { Card } from './Card';

export function IrrCard() {
  const irr = useLastResolved(irrSummary$);

  if (!irr) {
    return <SkeletonCard />;
  }

  const totalReturn = irr.total_returns * 100;
  const divReturn = irr.div_returns * 100;
  const isPositive = totalReturn >= 0;

  return (
    <Card
      title="IRR"
      mainValue={`${totalReturn.toFixed(2)}%`}
      subValue={<>Dividends {divReturn.toFixed(2)}%</>}
      isPositive={isPositive}
    />
  );
}
