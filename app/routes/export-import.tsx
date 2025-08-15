import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getWeightRecords, saveWeightRecord } from "../features/weights/api";
import { CreateWeightRecordInputSchema } from "../features/weights/types";

export default function ExportImport() {
  const { t } = useTranslation();
  const [importStatus, setImportStatus] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    try {
      const records = await getWeightRecords();
      const dataStr = JSON.stringify(records, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `weight-records-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error("Invalid file format: expected an array of records");
      }

      let successful = 0;
      let failed = 0;

      for (const record of data) {
        try {
          const validatedInput = CreateWeightRecordInputSchema.parse({
            date: record.date,
            weight: record.weight,
            fat_rate: record.fat_rate,
          });

          await saveWeightRecord(validatedInput);
          successful++;
        } catch (error) {
          failed++;
          console.error(`Failed to import record for date ${record.date}:`, error);
        }
      }

      setImportStatus(`Import complete: ${successful} records processed, ${failed} failed`);
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
      <p>The JSON file should contain an array of weight records:</p>
      <pre style={{ border: "1px solid black", padding: "10px", backgroundColor: "#f5f5f5" }}>
        {`[
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
]`}
      </pre>

      <br />
      <a href="/">{t("common.actions.backToHome")}</a>
    </div>
  );
}
