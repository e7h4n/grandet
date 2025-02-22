import { HTMLAttributes } from 'react';
import { useLastLoadable } from 'ccstate-react';
import { investments$ } from '../atoms/portfolio';
import Grid from '@mui/material/Grid2';
import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

interface Investment {
  currency: string;
  name: string;
  pnl: number;
}

function investmentName(name: string) {
  const parts = name.split(':');
  return parts[parts.length - 1];
}

function InvestmentList(props: HTMLAttributes<HTMLDivElement> & { investments: Investment[] }) {
  return (
    <TableContainer {...props}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">PnL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.investments.map((i) => (
            <TableRow key={i.name} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
              <TableCell>{investmentName(i.name)}</TableCell>
              <TableCell>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ flex: 1 }}>{i.currency}</div>
                  <div>
                    {i.pnl.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function Investments(props: HTMLAttributes<HTMLDivElement>) {
  const loadableInvestments = useLastLoadable(investments$);
  if (loadableInvestments.state !== 'hasData') {
    return <Skeleton />;
  }

  const { profitable, unprofitable } = loadableInvestments.data;

  return (
    <>
      <Grid container spacing={2} {...props}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" gutterBottom>
            Profitable Investments
          </Typography>
          <InvestmentList investments={profitable} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" gutterBottom>
            Unprofitable Investments
          </Typography>
          <InvestmentList investments={unprofitable} />
        </Grid>
      </Grid>
    </>
  );
}
