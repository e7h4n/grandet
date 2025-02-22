import { useLastResolved } from 'ccstate-react';
import { navIndex$ } from '../../atoms/portfolio';
import { SkeletonCard } from './SkeletonCard';
import { Card } from './Card';

export function NavCard() {
  const navIndex = useLastResolved(navIndex$);

  if (!navIndex) {
    return <SkeletonCard />;
  }

  const latestNav = navIndex[navIndex.length - 1];
  const firstNavThisYear = navIndex.find(([date]) => date.getFullYear() === new Date().getFullYear());
  const firstNavLastYear = navIndex.find(([date]) => date.getFullYear() === new Date().getFullYear() - 1);

  const currentNav = latestNav[1];
  const ytdChange = firstNavThisYear
    ? (currentNav / firstNavThisYear[1] - 1) * 100
    : (currentNav / (firstNavLastYear?.[1] ?? 1) - 1) * 100;

  return (
    <Card
      title="NAV"
      mainValue={currentNav.toFixed(2)}
      subValue={
        <>
          YTD {ytdChange > 0 ? '+' : ''}
          {ytdChange.toFixed(2)}%
        </>
      }
      isPositive={currentNav >= 1}
    />
  );
}
