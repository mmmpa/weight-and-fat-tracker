import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  clearDatabaseConfig,
  DatabaseConfigSchema,
  getDatabaseConfig,
  saveDatabaseConfig,
} from "../utils/localStorage";
import { testDatabaseConnection } from "../utils/turso";

export default function ConfigPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);

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
      setMessage("Database configuration saved and tables initialized successfully!");

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
    setMessage("Configuration cleared.");
  };

  return (
    <div>
      <h1>Database Configuration</h1>

      <p>
        Configure your Turso database connection. The system will automatically test the connection
        and create required tables when you save the configuration.
      </p>

      <form onSubmit={handleSubmit}>
        <table border={1} style={{ borderCollapse: "collapse", marginBottom: "20px" }}>
          <tbody>
            <tr>
              <td style={{ padding: "10px" }}>
                <label htmlFor="url">Database URL:</label>
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
                <label htmlFor="authToken">Auth Token (optional):</label>
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
          <button type="submit" disabled={isTestingConnection}>
            {isTestingConnection
              ? "Testing Connection & Creating Tables..."
              : "Save Configuration & Initialize Tables"}
          </button>{" "}
          <button type="button" onClick={handleClear} disabled={isTestingConnection}>
            Clear Configuration
          </button>
        </div>
      </form>

      {message && <div style={{ color: "green", marginBottom: "10px" }}>{message}</div>}

      {error && <div style={{ color: "red", marginBottom: "10px" }}>Error: {error}</div>}

      <div style={{ marginTop: "20px" }}>
        <Link to="/">← Back to Home</Link>
      </div>

      <hr style={{ margin: "30px 0" }} />

      <div>
        <h3>Current Configuration</h3>
        <table border={1} style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "5px" }}>Database URL:</td>
              <td style={{ padding: "5px", fontFamily: "monospace" }}>
                {url || "(not configured)"}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px" }}>Auth Token:</td>
              <td style={{ padding: "5px", fontFamily: "monospace" }}>
                {authToken ? "****** (configured)" : "(not set)"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr style={{ margin: "30px 0" }} />

      <div>
        <h3>Database Initialization</h3>
        <p>
          When you save the configuration, the following tables and indexes will be created if they
          don't exist:
        </p>
        <ul>
          <li>
            <strong>weight_records</strong> - Main table for storing weight and fat percentage data
          </li>
          <li>
            <strong>idx_weight_records_date</strong> - Index for date-based queries
          </li>
          <li>
            <strong>idx_weight_records_date_unique</strong> - Unique constraint to prevent duplicate
            dates
          </li>
        </ul>
        <p>
          All tables include proper constraints and validation rules as defined in TURSO_TABLES.md
        </p>
      </div>
    </div>
  );
}
