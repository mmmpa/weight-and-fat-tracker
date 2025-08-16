import { useLocation } from "react-router";
import { getCurrentMonthPath } from "../utils/navigation";
import { NavLink } from "./NavLink";

export function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Get current month info for display
  const currentDate = new Date();
  const _currentYear = currentDate.getFullYear();
  const _currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentMonthPath = getCurrentMonthPath();

  return (
    <div>
      <h1>1kg.app</h1>
      <hr />
      <p className="navigation-links">
        <NavLink to="/" isActive={isHomePage}>
          ホーム
        </NavLink>
        <NavLink to="/graph" isActive={location.pathname === "/graph"}>
          グラフ
        </NavLink>
        <NavLink to={currentMonthPath} isActive={location.pathname === currentMonthPath}>
          今月
        </NavLink>
        <NavLink to="/monthly" isActive={location.pathname === "/monthly"}>
          月別
        </NavLink>
        <NavLink to="/export-import" isActive={location.pathname === "/export-import"}>
          書出/読込
        </NavLink>
        <NavLink to="/config" isActive={location.pathname === "/config"}>
          設定
        </NavLink>
        <span className="nav-item">
          <small>
            build: {import.meta.env.VITE_GIT_COMMIT_HASH} ({import.meta.env.VITE_BUILD_DATE})
          </small>
        </span>
      </p>
      <hr />
    </div>
  );
}
