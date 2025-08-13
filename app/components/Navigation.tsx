import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { t } = useTranslation();

  return (
    <div>
      <h1>
        {t("common.appTitle")}
        <LanguageSwitcher />
      </h1>
      <hr />
      <p>
        {!isHomePage && (
          <>
            <Link to="/">{t("common.navigation.home")}</Link> |
          </>
        )}
        {location.pathname !== "/graph" && (
          <>
            <Link to="/graph">{t("common.navigation.graph")}</Link> |
          </>
        )}
        <Link to="/monthly">{t("common.navigation.monthly")}</Link> |{" "}
        <Link to="/config">{t("common.navigation.config")}</Link>
      </p>
      <hr />
    </div>
  );
}
