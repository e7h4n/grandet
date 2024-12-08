import { useLoadable, useSet } from "rippling";
import CalendarChart from "./components/CalendarChart";
import CashFlows from "./components/CashFlows";
import CumulativeReturns from "./components/CumulativeReturns";
import Investments from "./components/Investments";
import NavIndexChart from "./components/NavIndexChart";
import Summary from "./components/Summary";
import { authedAtom, logoutEffect, userAtom } from "./atoms/auth";
import { AuthPage } from "./components/AuthPage";

export default function App() {
  const logout = useSet(logoutEffect);
  const _user = useLoadable(userAtom);
  const _authed = useLoadable(authedAtom);

  if (_authed.state !== "hasData" || _user.state !== "hasData") {
    return <div>Loading...</div>;
  }

  if (!_authed.data) {
    return <AuthPage />;
  }

  return (
    <>
      <div>
        <p>Welcome</p>
        <p>Hi {_user.data?.name}, you are logged in.</p>
        <button
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
      </div>
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
