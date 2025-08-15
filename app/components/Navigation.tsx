import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { getCurrentMonthPath } from "../utils/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NavLink } from "./NavLink";

export function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { t } = useTranslation();

  // Get current month info for display
  const currentDate = new Date();
  const _currentYear = currentDate.getFullYear();
  const _currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentMonthPath = getCurrentMonthPath();

  return (
    <div>
      <h1>
        {t("common.appTitle")}
        <LanguageSwitcher />
      </h1>
      <hr />
      <p className="navigation-links">
        <NavLink to="/" isActive={isHomePage}>
          {t("common.navigation.home")}
        </NavLink>
        <NavLink to="/graph" isActive={location.pathname === "/graph"}>
          {t("common.navigation.graph")}
        </NavLink>
        <NavLink to={currentMonthPath} isActive={location.pathname === currentMonthPath}>
          {t("monthly.currentMonth")}
        </NavLink>
        <NavLink to="/monthly" isActive={location.pathname === "/monthly"}>
          {t("common.navigation.monthly")}
        </NavLink>
        <NavLink to="/export-import" isActive={location.pathname === "/export-import"}>
          {t("common.navigation.exportImport")}
        </NavLink>
        <NavLink to="/config" isActive={location.pathname === "/config"}>
          {t("common.navigation.config")}
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
