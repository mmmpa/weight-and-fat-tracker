import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { getCurrentMonthPath } from "../utils/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

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
      <p>
        {isHomePage ? (
          <span style={{ color: "black", fontWeight: "bold" }}>{t("common.navigation.home")}</span>
        ) : (
          <Link to="/">{t("common.navigation.home")}</Link>
        )}{" "}
        |{" "}
        {location.pathname === "/graph" ? (
          <span style={{ color: "black", fontWeight: "bold" }}>{t("common.navigation.graph")}</span>
        ) : (
          <Link to="/graph">{t("common.navigation.graph")}</Link>
        )}{" "}
        |{" "}
        {location.pathname === currentMonthPath ? (
          <span style={{ color: "black", fontWeight: "bold" }}>{t("monthly.currentMonth")}</span>
        ) : (
          <Link to={currentMonthPath}>{t("monthly.currentMonth")}</Link>
        )}{" "}
        |{" "}
        {location.pathname === "/monthly" ? (
          <span style={{ color: "black", fontWeight: "bold" }}>
            {t("common.navigation.monthly")}
          </span>
        ) : (
          <Link to="/monthly">{t("common.navigation.monthly")}</Link>
        )}{" "}
        |{" "}
        {location.pathname === "/export-import" ? (
          <span style={{ color: "black", fontWeight: "bold" }}>
            {t("common.navigation.exportImport")}
          </span>
        ) : (
          <Link to="/export-import">{t("common.navigation.exportImport")}</Link>
        )}{" "}
        |{" "}
        {location.pathname === "/config" ? (
          <span style={{ color: "black", fontWeight: "bold" }}>
            {t("common.navigation.config")}
          </span>
        ) : (
          <Link to="/config">{t("common.navigation.config")}</Link>
        )}{" "}
        |{" "}
        <small>
          build: {import.meta.env.VITE_GIT_COMMIT_HASH} ({import.meta.env.VITE_BUILD_DATE})
        </small>
      </p>
      <hr />
    </div>
  );
}
