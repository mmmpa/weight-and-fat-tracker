import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

// Create a mock component that mirrors the ExportImport component structure
function MockExportImport() {
  const [importStatus, setImportStatus] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    // Mock export functionality for Storybook
    alert("Export functionality would download a JSON file with your weight records.");
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStatus("Processing...");

    // Mock import functionality for Storybook
    setTimeout(() => {
      if (file.name.includes("error")) {
        setImportStatus("Import failed: Invalid file format");
      } else {
        setImportStatus("Import complete: 15 new records, 5 updated, 0 failed");
      }
      setIsProcessing(false);
      if (event.target) {
        event.target.value = "";
      }
    }, 2000);
  };

  return (
    <div>
      <h1>Export/Import Weight Records</h1>

      <h2>Export Data</h2>
      <p>Download all your weight records as a JSON file.</p>
      <button type="button" onClick={handleExport}>
        Export All Records
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
      <a href="/">Back to Home</a>
    </div>
  );
}

const meta = {
  title: "Pages/ExportImport",
  component: MockExportImport,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MockExportImport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Story with pre-set import status
export const WithSuccessfulImport: Story = {
  render: () => {
    function MockExportImportWithStatus() {
      const [importStatus] = useState<string>(
        "Import complete: 25 new records, 10 updated, 0 failed"
      );
      const [isProcessing] = useState(false);

      const handleExport = async () => {
        alert("Export functionality would download a JSON file with your weight records.");
      };

      const handleImport = async () => {
        // Mock for story - no action needed
      };

      return (
        <div>
          <h1>Export/Import Weight Records</h1>

          <h2>Export Data</h2>
          <p>Download all your weight records as a JSON file.</p>
          <button type="button" onClick={handleExport}>
            Export All Records
          </button>

          <br />
          <br />

          <h2>Import Data</h2>
          <p>
            Import weight records from a JSON file. Existing records will be updated, new records
            will be added.
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
          <a href="/">Back to Home</a>
        </div>
      );
    }

    return <MockExportImportWithStatus />;
  },
};

export const WithFailedImport: Story = {
  render: () => {
    function MockExportImportWithError() {
      const [importStatus] = useState<string>(
        "Import failed: Invalid file format: expected an array of records"
      );
      const [isProcessing] = useState(false);

      const handleExport = async () => {
        alert("Export functionality would download a JSON file with your weight records.");
      };

      const handleImport = async () => {
        // Mock for story - no action needed
      };

      return (
        <div>
          <h1>Export/Import Weight Records</h1>

          <h2>Export Data</h2>
          <p>Download all your weight records as a JSON file.</p>
          <button type="button" onClick={handleExport}>
            Export All Records
          </button>

          <br />
          <br />

          <h2>Import Data</h2>
          <p>
            Import weight records from a JSON file. Existing records will be updated, new records
            will be added.
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
          <a href="/">Back to Home</a>
        </div>
      );
    }

    return <MockExportImportWithError />;
  },
};

export const ProcessingImport: Story = {
  render: () => {
    function MockExportImportProcessing() {
      const [importStatus] = useState<string>("Processing...");
      const [isProcessing] = useState(true);

      const handleExport = async () => {
        alert("Export functionality would download a JSON file with your weight records.");
      };

      const handleImport = async () => {
        // Mock for story - no action needed
      };

      return (
        <div>
          <h1>Export/Import Weight Records</h1>

          <h2>Export Data</h2>
          <p>Download all your weight records as a JSON file.</p>
          <button type="button" onClick={handleExport}>
            Export All Records
          </button>

          <br />
          <br />

          <h2>Import Data</h2>
          <p>
            Import weight records from a JSON file. Existing records will be updated, new records
            will be added.
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
          <a href="/">Back to Home</a>
        </div>
      );
    }

    return <MockExportImportProcessing />;
  },
};
