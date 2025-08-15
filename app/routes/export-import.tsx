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
      alert(
        `${t("errors.exportFailed")} ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStatus(t("common.status.processing"));

    try {
      const text = await file.text();
      const result = await importWeightRecords(text);
      setImportStatus(
        t("exportImport.import.complete", {
          new: result.successful,
          updated: 0, // The API doesn't distinguish between new and updated
          failed: result.failed,
        })
      );
    } catch (error) {
      setImportStatus(
        `${t("errors.importFailed")} ${error instanceof Error ? error.message : "Unknown error"}`
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
      <h1>{t("exportImport.title")}</h1>

      <h2>{t("exportImport.export.title")}</h2>
      <p>{t("exportImport.export.description")}</p>
      <button type="button" onClick={handleExport}>
        {t("common.actions.export")}
      </button>

      <br />
      <br />

      <h2>{t("exportImport.import.title")}</h2>
      <p>{t("exportImport.import.description")}</p>
      <input type="file" accept=".json" onChange={handleImport} disabled={isProcessing} />

      {importStatus && (
        <div>
          <br />
          <strong>{t("common.status.status")}</strong> {importStatus}
        </div>
      )}

      <br />
      <br />

      <h3>{t("exportImport.fileFormat.title")}</h3>
      <p>{t("exportImport.fileFormat.description")}</p>
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
        <em>{t("exportImport.fileFormat.note")}</em>
      </p>

      <br />
      <a href="/">{t("common.actions.backToHome")}</a>
    </div>
  );
}
