import { type FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { resetWeightDatabase } from "../features/weights/api";
import {
  clearDatabaseConfig,
  DatabaseConfigSchema,
  getDatabaseConfig,
  saveDatabaseConfig,
} from "../utils/localStorage";
import { testDatabaseConnection } from "../utils/turso";

export default function ConfigPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isResettingDatabase, setIsResettingDatabase] = useState(false);

  useEffect(() => {
    (async () => {
      const config = await getDatabaseConfig();
      if (config) {
        setUrl(config.url);
        setAuthToken(config.authToken || "");
      }
    })();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsTestingConnection(true);

    try {
      const config = DatabaseConfigSchema.parse({
        url,
        authToken: authToken.trim() || undefined,
      });

      // Test connection and initialize tables
      await testDatabaseConnection(config.url, config.authToken);

      await saveDatabaseConfig(config);
      setMessage(t("config.success"));

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid configuration or connection failed");
      }
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleClear = async () => {
    await clearDatabaseConfig();
    setUrl("");
    setAuthToken("");
    setMessage(t("config.cleared"));
  };

  const handleResetDatabase = async () => {
    if (
      !confirm(
        "Are you sure you want to reset the database? This will delete ALL weight records permanently!"
      )
    ) {
      return;
    }

    setMessage("");
    setError("");
    setIsResettingDatabase(true);

    try {
      await resetWeightDatabase();
      setMessage("Database reset successfully. All weight records have been deleted.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to reset database");
      }
    } finally {
      setIsResettingDatabase(false);
    }
  };

  return (
    <div>
      <h1>{t("config.title")}</h1>

      <p>{t("config.description")}</p>

      <form onSubmit={handleSubmit}>
        <table border={1} style={{ borderCollapse: "collapse", marginBottom: "20px" }}>
          <tbody>
            <tr>
              <td style={{ padding: "10px" }}>
                <label htmlFor="url">{t("config.dbUrl")}</label>
              </td>
              <td style={{ padding: "10px" }}>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  size={50}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px" }}>
                <label htmlFor="authToken">{t("config.authToken")}</label>
              </td>
              <td style={{ padding: "10px" }}>
                <input
                  type="password"
                  id="authToken"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  size={50}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginBottom: "10px" }}>
          <button type="submit" disabled={isTestingConnection || isResettingDatabase}>
            {isTestingConnection ? t("config.testing") : t("config.saveButton")}
          </button>{" "}
          <button
            type="button"
            onClick={handleClear}
            disabled={isTestingConnection || isResettingDatabase}
          >
            {t("common.actions.clear")}
          </button>
        </div>
      </form>

      {message && <div style={{ color: "green", marginBottom: "10px" }}>{message}</div>}

      {error && <div style={{ color: "red", marginBottom: "10px" }}>Error: {error}</div>}

      <div style={{ marginTop: "20px" }}>
        <Link to="/">← {t("common.actions.backToHome")}</Link>
      </div>

      <hr style={{ margin: "30px 0" }} />

      <div>
        <h3>{t("config.currentConfig")}</h3>
        <table border={1} style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "5px" }}>{t("config.dbUrl")}</td>
              <td style={{ padding: "5px", fontFamily: "monospace" }}>
                {url || t("config.notConfigured")}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px" }}>{t("config.authToken")}</td>
              <td style={{ padding: "5px", fontFamily: "monospace" }}>
                {authToken ? t("config.configured") : t("config.notSet")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr style={{ margin: "30px 0" }} />

      <div>
        <h3 style={{ color: "red" }}>⚠️ Danger Zone</h3>
        <p>
          <strong>Reset Database:</strong> This will permanently delete ALL weight records from the
          database. This action cannot be undone!
        </p>
        <button
          type="button"
          onClick={handleResetDatabase}
          disabled={isResettingDatabase || isTestingConnection}
          style={{
            backgroundColor: "#dc2626",
            color: "white",
            padding: "10px 15px",
            border: "1px solid #b91c1c",
            cursor: isResettingDatabase ? "not-allowed" : "pointer",
          }}
        >
          {isResettingDatabase ? "Resetting..." : "Reset Database"}
        </button>
      </div>
    </div>
  );
}
