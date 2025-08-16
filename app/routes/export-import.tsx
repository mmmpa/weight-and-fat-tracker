import { useState } from "react";
import {
  downloadExportFile,
  exportWeightRecords,
  importWeightRecords,
} from "../features/export-import/api";

export default function ExportImport() {
  const [importStatus, setImportStatus] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    try {
      const exportData = await exportWeightRecords();
      downloadExportFile(exportData);
    } catch (error) {
      alert(
        `エクスポートに失敗しました: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStatus("処理中...");

    try {
      const text = await file.text();
      const result = await importWeightRecords(text);
      setImportStatus(
        `インポート完了: ${result.successful}件の新規、${0}件の更新、${result.failed}件の失敗`
      );
    } catch (error) {
      setImportStatus(
        `インポートに失敗しました: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsProcessing(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  return (
    <div>
      <h1>体重記録のエクスポート/インポート</h1>

      <h2>データのエクスポート</h2>
      <p>全ての体重記録をJSONファイルでダウンロードします。</p>
      <button type="button" onClick={handleExport}>
        全記録をエクスポート
      </button>

      <br />
      <br />

      <h2>データのインポート</h2>
      <p>
        JSONファイルから体重記録をインポートします。既存の記録は更新され、新しい記録は追加されます。
      </p>
      <input type="file" accept=".json" onChange={handleImport} disabled={isProcessing} />

      {importStatus && (
        <div>
          <br />
          <strong>ステータス:</strong> {importStatus}
        </div>
      )}

      <br />
      <br />

      <h3>ファイル形式</h3>
      <p>JSONファイルにはバージョンフィールドと記録の配列を含める必要があります:</p>
      <pre style={{ border: "1px solid black", padding: "10px", backgroundColor: "#f5f5f5" }}>
        {`{
  "version": 1,
  "records": [
    {
      "date": "2024-01-15",
      "weight": 70.5,
      "fat_rate": 18.5
    },
    {
      "date": "2024-01-16",
      "weight": 70.3,
      "fat_rate": 18.4
    }
  ]
}`}
      </pre>
      <p>
        <em>注意: 旧形式（単純な配列）もインポート時にサポートされています。</em>
      </p>

      <br />
      <a href="/">ホームに戻る</a>
    </div>
  );
}
