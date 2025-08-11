import { Link, useLocation } from "react-router";

export function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div>
      <h1>Weight & Fat Tracker</h1>
      <hr />
      <p>
        {!isHomePage && (
          <>
            <Link to="/">Home</Link> |
          </>
        )}
        {location.pathname !== "/graph" && (
          <>
            <Link to="/graph">Graph</Link> |
          </>
        )}
        <Link to="/monthly">Monthly</Link> | <Link to="/config">Config</Link>
      </p>
      <hr />
    </div>
  );
}
