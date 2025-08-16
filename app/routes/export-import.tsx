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
      alert(`出力失敗: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStatus("処理中");

    try {
      const text = await file.text();
      const result = await importWeightRecords(text);
      setImportStatus(`読込完了: 新${result.successful}件 失敗${result.failed}件`);
    } catch (error) {
      setImportStatus(`読込失敗: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsProcessing(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  return (
    <div>
      <h1>書出/読込</h1>
      <h2>書出</h2>
      <button type="button" onClick={handleExport}>
        書出
      </button>
      <h2>読込</h2>
      <input type="file" accept=".json" onChange={handleImport} disabled={isProcessing} />
      {importStatus && (
        <div>
          <br />
          <strong>状態:</strong> {importStatus}
        </div>
      )}
      <h3>形式</h3>
      <pre style={{ border: "1px solid black", padding: "10px", backgroundColor: "#f5f5f5" }}>
        {`{
  "version": 1,
  "records": [
    {
      "date": "2024-01-15",
      "weight": 70.5,
      "fat_rate": 18.5
    }
  ]
}`}
      </pre>
    </div>
  );
}
