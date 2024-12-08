import { HTMLAttributes } from "react";
import { useLoadable } from "rippling";
import { cashFlows } from "../atoms/portfolio";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface CashFlow {
  account: string;
  amount: {
    currency: string;
    number: number;
  };
  date: string;
  is_dividend: boolean;
  source: string;
}

export default function CashFlows(props: HTMLAttributes<HTMLDivElement>) {
  const loadableCashFlows = useLoadable(cashFlows);
  if (loadableCashFlows.state !== "hasData") {
    return <div>Loading...</div>;
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
            {loadableCashFlows.data.map((cf: CashFlow, i: number) => (
              <TableRow key={i}>
                <TableCell>{cf.date}</TableCell>
                <TableCell>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ flex: 1 }}>{cf.amount.currency}</div>
                    <div>
                      {cf.amount.number.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{cf.is_dividend ? "*" : ""}</TableCell>
                <TableCell>{cf.account}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
