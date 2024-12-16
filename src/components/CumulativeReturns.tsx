import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useLastLoadable } from 'rippling';
import { cumulativeReturns$ } from '../atoms/portfolio';
import { HTMLAttributes } from 'react';
import { Skeleton, Typography } from '@mui/material';

export default function CumulativeReturns(props: HTMLAttributes<HTMLDivElement>) {
  const tableData = useLastLoadable(cumulativeReturns$);
  if (tableData.state !== 'hasData') {
    return <Skeleton />;
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Internal Rate of Returns
      </Typography>
      <TableContainer {...props}>
        <Table>
          <TableHead>
            <TableRow>
              {tableData.data[0].map((header: string, i: number) => (
                <TableCell key={i}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.data[1].map((row: string[], i: number) => (
              <TableRow key={i}>
                {row.map((cell: number | string, j: number) => (
                  <TableCell key={j}>
                    {typeof cell === 'number' ? String((cell * 100).toFixed(2)) + '%' : cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
