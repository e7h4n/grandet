import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useLastLoadable } from 'ccstate-react';
import { cumulativeReturns$ } from '../atoms/portfolio';
import { HTMLAttributes } from 'react';
import { Skeleton, Typography, Card, CardContent } from '@mui/material';

export default function CumulativeReturns(props: HTMLAttributes<HTMLDivElement>) {
  const tableData = useLastLoadable(cumulativeReturns$);

  if (tableData.state !== 'hasData') {
    return (
      <Card>
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
            variant="h2"
            sx={{
              fontSize: '1.25rem',
              color: 'text.secondary',
              mb: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            Internal Rate of Returns
          </Typography>
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{
              borderRadius: 1,
              transform: 'none',
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
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
          variant="h2"
          sx={{
            fontSize: '1.25rem',
            color: 'text.secondary',
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
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
      </CardContent>
    </Card>
  );
}
