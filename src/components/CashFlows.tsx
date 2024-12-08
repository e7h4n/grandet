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
            {loadableCashFlows.data.map((cf, i) => (
              <TableRow key={i}>
                <TableCell>{cf.date.toLocaleDateString()}</TableCell>
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
                <TableCell>{cf.isDividend ? "*" : ""}</TableCell>
                <TableCell>{cf.account}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
