import { HTMLAttributes } from 'react';
import { useLastLoadable } from 'ccstate-react';
import { cashFlows } from '../atoms/portfolio';
import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

function investmentName(name: string) {
  const parts = name.split(':');
  return parts[parts.length - 1];
}
export default function CashFlows(props: HTMLAttributes<HTMLDivElement>) {
  const loadableCashFlows = useLastLoadable(cashFlows);
  if (loadableCashFlows.state !== 'hasData') {
    return <Skeleton />;
  }

  return (
    <div {...props}>
      <Typography variant="h5" gutterBottom>
        Cash Flows
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>D</TableCell>
              <TableCell>Investment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadableCashFlows.data.map((cf, i) => (
              <TableRow key={i}>
                <TableCell>{cf.date.toLocaleDateString()}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ flex: 1 }}>{cf.amount.currency}</div>
                    <div>
                      {cf.amount.number.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{cf.isDividend ? '*' : ''}</TableCell>
                <TableCell>{investmentName(cf.account)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
