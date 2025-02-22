import { useLastResolved } from 'ccstate-react';
import { SkeletonCard } from './SkeletonCard';
import { shortAssets$ } from '../../atoms/portfolio';
import { Amount } from './Amount';
import { Card } from './Card';

export function AssetCard() {
  const shortAssets = useLastResolved(shortAssets$);

  if (!shortAssets) {
    return <SkeletonCard />;
  }

  const currentAssets = shortAssets[1][1] as number;
  const ytdChange = (currentAssets - shortAssets[0][1]) as number;
  const isPositive = ytdChange >= 0;

  return (
    <Card
      title="Total Assets"
      mainValue={<Amount value={currentAssets} currency="USD" showFlag="negative" />}
      subValue={
        <>
          YTD <Amount value={ytdChange} showFlag="both" />
        </>
      }
      isPositive={isPositive}
    />
  );
}
