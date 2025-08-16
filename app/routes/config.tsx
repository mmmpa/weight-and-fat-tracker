import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { resetWeightDatabase } from "../features/weights/api";
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
      setMessage("設定保存完了");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("設定エラー");
      }
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleClear = async () => {
    await clearDatabaseConfig();
    setUrl("");
    setAuthToken("");
    setMessage("クリア済み");
  };

  const handleResetDatabase = async () => {
    if (!confirm("全データ削除します。")) {
      return;
    }

    setMessage("");
    setError("");
    setIsResettingDatabase(true);

    try {
      await resetWeightDatabase();
      setMessage("リセット完了");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("リセット失敗");
      }
    } finally {
      setIsResettingDatabase(false);
    }
  };

  return (
    <div>
      <h1>DB設定</h1>
      <form onSubmit={handleSubmit}>
        <table border={1} style={{ borderCollapse: "collapse", marginBottom: "20px" }}>
          <tbody>
            <tr>
              <td style={{ padding: "10px" }}>
                <label htmlFor="url">DB URL:</label>
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
                <label htmlFor="authToken">トークン:</label>
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
            {isTestingConnection ? "処理中..." : "保存"}
          </button>{" "}
          <button
            type="button"
            onClick={handleClear}
            disabled={isTestingConnection || isResettingDatabase}
          >
            クリア
          </button>
        </div>
      </form>
      {message && <div style={{ color: "green", marginBottom: "10px" }}>{message}</div>}
      {error && <div style={{ color: "red", marginBottom: "10px" }}>Error: {error}</div>}
      <table border={1} style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ padding: "5px" }}>DB URL:</td>
            <td style={{ padding: "5px", fontFamily: "monospace" }}>{url || "(未設定)"}</td>
          </tr>
          <tr>
            <td style={{ padding: "5px" }}>トークン:</td>
            <td style={{ padding: "5px", fontFamily: "monospace" }}>
              {authToken ? "******" : "なし"}
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button
          type="button"
          onClick={handleResetDatabase}
          disabled={isResettingDatabase || isTestingConnection}
        >
          {isResettingDatabase ? "処理中..." : "DBリセット"}
        </button>
      </div>
    </div>
  );
}
