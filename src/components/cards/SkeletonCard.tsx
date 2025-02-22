import { Skeleton } from '@mui/material';
import { Card } from './Card';

export function SkeletonCard() {
  return (
    <Card
      title={<Skeleton width={80} />}
      mainValue={<Skeleton width={120} />}
      subValue={<Skeleton width={100} />}
      isPositive={true}
    />
  );
}
