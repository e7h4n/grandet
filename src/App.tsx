import CalendarChart from "./components/CalendarChart";
import CashFlows from "./components/CashFlows";
import CumulativeReturns from "./components/CumulativeReturns";
import Investments from "./components/Investments";
import NavIndexChart from "./components/NavIndexChart";
import Summary from "./components/Summary";

export default function App() {
  return (
    <>
      <Summary />
      <div style={{ display: "flex", width: "100vw", height: "300px" }}>
        <NavIndexChart style={{ flex: 1 }} />
        <CalendarChart style={{ flex: 1 }} />
      </div>
      <CumulativeReturns />
      <Investments />
      <CashFlows />
    </>
  );
}
