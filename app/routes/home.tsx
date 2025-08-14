import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "Weight & Fat Tracker" },
    { name: "description", content: "Track your weight and body fat percentage" },
  ];
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("home.title")}</h1>

      <h2>{t("home.welcome.title")}</h2>
      <p>{t("home.welcome.description")}</p>

      <h3>{t("home.features.title")}</h3>
      <p>
        <strong>{t("home.features.dailyTracking.title")}</strong>
        <br />
        {t("home.features.dailyTracking.description")}
        <br />
        <br />
        <strong>{t("home.features.monthlyView.title")}</strong>
        <br />
        {t("home.features.monthlyView.description")}
        <br />
        <br />
        <strong>{t("home.features.graphs.title")}</strong>
        <br />
        {t("home.features.graphs.description")}
        <br />
        <br />
        <strong>{t("home.features.exportImport.title")}</strong>
        <br />
        {t("home.features.exportImport.description")}
      </p>

      <h3>{t("home.dataStorage.title")}</h3>
      <p>
        {t("home.dataStorage.local")}
        <br />
        {t("home.dataStorage.noBackend")}
        <br />
        {t("home.dataStorage.turso")}
      </p>

      <h3>{t("home.navigation.title")}</h3>
      <p>
        <Link to="/dashboard">{t("home.navigation.dashboard")}</Link> -{" "}
        {t("home.navigation.dashboardDesc")}
        <br />
        <Link to="/monthly">{t("home.navigation.monthly")}</Link> -{" "}
        {t("home.navigation.monthlyDesc")}
        <br />
        <Link to="/graph">{t("home.navigation.graph")}</Link> - {t("home.navigation.graphDesc")}
        <br />
        <Link to="/export-import">{t("home.navigation.exportImport")}</Link> -{" "}
        {t("home.navigation.exportImportDesc")}
        <br />
        <Link to="/config">{t("home.navigation.config")}</Link> - {t("home.navigation.configDesc")}
      </p>

      <h3>{t("home.gettingStarted.title")}</h3>
      <p>
        {t("home.gettingStarted.step1")}
        <br />
        {t("home.gettingStarted.step2")}
        <br />
        {t("home.gettingStarted.step3")}
      </p>
    </div>
  );
}
