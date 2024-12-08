import { HTMLAttributes } from "react";
import { useLoadable } from "rippling";
import { investments } from "../atoms/portfolio";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface Investment {
  currency: string;
  name: string;
  pnl: number;
}

function InvestmentList(
  props: HTMLAttributes<HTMLDivElement> & { investments: Investment[] }
) {
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
            <TableRow
              key={i.name}
              sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" } }}
            >
              <TableCell>{i.name}</TableCell>
              <TableCell>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
  const loadableInvestments = useLoadable(investments);
  if (loadableInvestments.state !== "hasData") {
    return <div {...props}>Loading...</div>;
  }
  const { profitable, unprofitable } = loadableInvestments.data;

  return (
    <>
      <div {...props}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom>
              Profitable Investments
            </Typography>
            <InvestmentList investments={profitable} />
          </div>
          <div style={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom>
              Unprofitable Investments
            </Typography>
            <InvestmentList investments={unprofitable} />
          </div>
        </div>
      </div>
    </>
  );
}