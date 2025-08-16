import { type FormEvent, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { resetWeightDatabase } from "../features/weights/api";
import {
  clearDatabaseConfig,
  DatabaseConfigSchema,
  getDatabaseConfig,
  saveDatabaseConfig,
} from "../utils/localStorage";
import { testDatabaseConnection } from "../utils/turso";

export async function clientLoader() {
  const config = await getDatabaseConfig();
  return {
    url: config?.url || "",
    authToken: config?.authToken || "",
  };
}

export default function ConfigPage() {
  const { url: initialUrl, authToken: initialAuthToken } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const [url, setUrl] = useState(initialUrl);
  const [authToken, setAuthToken] = useState(initialAuthToken);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isResettingDatabase, setIsResettingDatabase] = useState(false);

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
      <h1>設定</h1>
      <p>localStorageに保存する。</p>
      <form onSubmit={handleSubmit}>
        <table border={1} style={{ borderCollapse: "collapse", marginBottom: "20px" }}>
          <tbody>
            <tr>
              <td style={{ padding: "10px" }}>
                <label htmlFor="url">Turso URL</label>
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
                <label htmlFor="authToken">Turso Token</label>
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
      <div>
        <button
          type="button"
          onClick={handleResetDatabase}
          disabled={isResettingDatabase || isTestingConnection}
        >
          {isResettingDatabase ? "処理中..." : "DBデータリセット"}
        </button>
      </div>
    </div>
  );
}
