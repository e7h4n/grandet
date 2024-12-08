import { HTMLAttributes } from "react";
import CalendarChart from "./CalendarChart";
import CashFlows from "./CashFlows";
import CumulativeReturns from "./CumulativeReturns";
import Investments from "./Investments";
import NavIndexChart from "./NavIndexChart";
import Summary from "./Summary";
import Grid from "@mui/material/Grid2";

export default function Dashboard(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <Grid container spacing={2} {...props}>
      <Grid size={12}>
        <Summary />
      </Grid>
      <Grid size={6}>
        <NavIndexChart style={{ height: "300px" }} />
      </Grid>
      <Grid size={6}>
        <CalendarChart style={{ height: "300px" }} />
      </Grid>
      <Grid size={12}>
        <CumulativeReturns />
      </Grid>
      <Grid size={12}>
        <Investments />
      </Grid>
      <Grid size={12}>
        <CashFlows />
      </Grid>
    </Grid>
  );
}
