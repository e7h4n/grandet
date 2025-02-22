import { useLastResolved } from 'ccstate-react';
import { holding$ } from '../../atoms/portfolio';
import { SkeletonCard } from './SkeletonCard';
import { Card } from './Card';
import { Amount } from './Amount';

export function DailyChangeCard() {
  const holding = useLastResolved(holding$);

  if (!holding) {
    return <SkeletonCard />;
  }

  const [changeValue, currency] = holding.today_market_value_change;
  const changePercent = parseFloat(holding.today_market_value_change_ratio);
  const isPositive = parseFloat(changeValue) >= 0;

  return (
    <Card
      title="Daily Change"
      mainValue={`${changePercent > 0 ? '+' : ''}${(changePercent * 100).toFixed(2)}%`}
      subValue={<Amount value={parseFloat(changeValue)} currency={currency} showFlag="both" />}
      isPositive={isPositive}
    />
  );
}
