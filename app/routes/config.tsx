import { type FormEvent, useEffect, useState } from "react";
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
      setMessage("データベース設定が保存され、テーブルが正常に初期化されました！");

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
    setMessage("設定がクリアされました。");
  };

  const handleResetDatabase = async () => {
    if (
      !confirm("データベースをリセットしてもよろしいですか？全ての体重記録が完全に削除されます！")
    ) {
      return;
    }

    setMessage("");
    setError("");
    setIsResettingDatabase(true);

    try {
      await resetWeightDatabase();
      setMessage("データベースが正常にリセットされました。全ての体重記録が削除されました。");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("データベースのリセットに失敗しました");
      }
    } finally {
      setIsResettingDatabase(false);
    }
  };

  return (
    <div>
      <h1>データベース設定</h1>

      <p>
        Tursoデータベース接続を設定します。設定を保存すると、システムが自動的に接続をテストし、必要なテーブルを作成します。
      </p>

      <form onSubmit={handleSubmit}>
        <table border={1} style={{ borderCollapse: "collapse", marginBottom: "20px" }}>
          <tbody>
            <tr>
              <td style={{ padding: "10px" }}>
                <label htmlFor="url">データベースURL:</label>
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
                <label htmlFor="authToken">認証トークン (オプション):</label>
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
            {isTestingConnection
              ? "接続テスト中・テーブル作成中..."
              : "設定を保存しテーブルを初期化"}
          </button>{" "}
          <button
            type="button"
            onClick={handleClear}
            disabled={isTestingConnection || isResettingDatabase}
          >
            設定をクリア
          </button>
        </div>
      </form>

      {message && <div style={{ color: "green", marginBottom: "10px" }}>{message}</div>}

      {error && <div style={{ color: "red", marginBottom: "10px" }}>Error: {error}</div>}

      <div style={{ marginTop: "20px" }}>
        <Link to="/">← ホームに戻る</Link>
      </div>

      <hr style={{ margin: "30px 0" }} />

      <div>
        <h3>現在の設定</h3>
        <table border={1} style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "5px" }}>データベースURL:</td>
              <td style={{ padding: "5px", fontFamily: "monospace" }}>{url || "(未設定)"}</td>
            </tr>
            <tr>
              <td style={{ padding: "5px" }}>認証トークン (オプション):</td>
              <td style={{ padding: "5px", fontFamily: "monospace" }}>
                {authToken ? "****** (設定済み)" : "(未設定)"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr style={{ margin: "30px 0" }} />

      <div>
        <h3 style={{ color: "red" }}>⚠️ 危険ゾーン</h3>
        <p>
          <strong>データベースリセット:</strong>{" "}
          データベースから全ての体重記録を完全に削除します。この操作は元に戻せません！
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
          {isResettingDatabase ? "リセット中..." : "データベースをリセット"}
        </button>
      </div>
    </div>
  );
}
