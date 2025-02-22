import { Card as MuiCard, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ReactNode } from 'react';

export type CardContentProps = {
  title: ReactNode;
  mainValue: ReactNode;
  subValue: ReactNode;
  isPositive: boolean;
};

export function Card({ title, mainValue, subValue, isPositive }: CardContentProps) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
      <MuiCard>
        <CardContent
          sx={{
            py: 1.5,
            px: 1.5,
            '&:last-child': {
              pb: 1.5,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: 'text.secondary',
              mb: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: '1.1rem',
              color: isPositive ? 'success.main' : 'error.main',
              fontWeight: 'bold',
              lineHeight: 1.2,
            }}
          >
            {mainValue}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 0.5,
            }}
          >
            {subValue}
          </Typography>
        </CardContent>
      </MuiCard>
    </Grid>
  );
}
