import { useLoadable } from "rippling";
import { pnl, irrSummary, navIndex } from "../atoms/portfolio";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function Summary() {
  const pnl_ = useLoadable(pnl);
  const irrSummary_ = useLoadable(irrSummary);
  const navIndex_ = useLoadable(navIndex);

  if (
    pnl_.state !== "hasData" ||
    irrSummary_.state !== "hasData" ||
    navIndex_.state !== "hasData"
  ) {
    return <div>Loading...</div>;
  }

  const pnlData = pnl_.data;
  const irrData = irrSummary_.data;
  const latestNavIndex = navIndex_.data[navIndex_.data.length - 1][1];
  const total_pnl =
    pnlData.realized_pnl_ex_fee +
    pnlData.unrealized_pnl +
    pnlData.dividend_ex_tax;

  const renderCard = (
    title: string,
    value: string | number,
    isPositive: boolean,
    numberTitle?: string
  ) => (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography
          variant="h5"
          component="div"
          sx={{
            color: isPositive ? "success.main" : "error.main",
            fontWeight: "bold",
          }}
        >
          {value}
        </Typography>
        {numberTitle && (
          <Typography variant="body2" color="text.secondary">
            {numberTitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        gridTemplateRows: "auto",
        gap: "10px",
      }}
    >
      {renderCard(
        "Total PnL",
        pnlData.currency +
          " " +
          total_pnl.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          }),
        total_pnl > 0,
        `Including ${pnlData.dividend_ex_tax.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })} in dividends`
      )}
      {renderCard("Nav Index", latestNavIndex.toFixed(2), latestNavIndex > 0)}
      {renderCard(
        "Yearly Nav",
        `${(Math.pow(latestNavIndex, 1 / irrData.years) * 100 - 100).toFixed(
          2
        )}%`,
        latestNavIndex > 0
      )}
      {renderCard(
        "IRR",
        `${(irrData.total_returns * 100).toFixed(2)}%`,
        irrData.total_returns > 0,
        `Total returns over ${irrData.years.toFixed(1)} years`
      )}
      {renderCard(
        "Dividends",
        `${(irrData.div_returns * 100).toFixed(2)}%`,
        irrData.div_returns > 0,
        `Total dividends over ${irrData.years.toFixed(1)} years`
      )}
    </Box>
  );
}
