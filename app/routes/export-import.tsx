import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  downloadExportFile,
  exportWeightRecords,
  importWeightRecords,
} from "../features/export-import/api";

export default function ExportImport() {
  const { t } = useTranslation();
  const [importStatus, setImportStatus] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    try {
      const exportData = await exportWeightRecords();
      downloadExportFile(exportData);
    } catch (error) {
      alert(`Export failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStatus("Processing...");

    try {
      const text = await file.text();
      const result = await importWeightRecords(text);
      setImportStatus(result.message);
    } catch (error) {
      setImportStatus(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsProcessing(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  return (
    <div>
      <h1>Export/Import Weight Records</h1>

      <h2>Export Data</h2>
      <p>Download all your weight records as a JSON file.</p>
      <button type="button" onClick={handleExport}>
        {t("common.actions.export")}
      </button>

      <br />
      <br />

      <h2>Import Data</h2>
      <p>
        Import weight records from a JSON file. Existing records will be updated, new records will
        be added.
      </p>
      <input type="file" accept=".json" onChange={handleImport} disabled={isProcessing} />

      {importStatus && (
        <div>
          <br />
          <strong>Status:</strong> {importStatus}
        </div>
      )}

      <br />
      <br />

      <h3>File Format</h3>
      <p>The JSON file should contain a version field and records array:</p>
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
        <em>Note: The old format (plain array) is still supported for import.</em>
      </p>

      <br />
      <a href="/">{t("common.actions.backToHome")}</a>
    </div>
  );
}
