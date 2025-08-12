import type { Meta, StoryObj } from "@storybook/react";
import { type FormEvent, useState } from "react";
import { Link } from "react-router";

// Create a mock component that mirrors the ConfigPage component structure
function MockConfigPage({
  initialUrl = "",
  initialAuthToken = "",
  initialMessage = "",
  initialError = "",
}: {
  initialUrl?: string;
  initialAuthToken?: string;
  initialMessage?: string;
  initialError?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [authToken, setAuthToken] = useState(initialAuthToken);
  const [message, setMessage] = useState(initialMessage);
  const [error, setError] = useState(initialError);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsTestingConnection(true);

    // Mock the connection test for Storybook
    setTimeout(() => {
      if (url.includes("invalid")) {
        setError("Connection failed: Invalid database URL");
      } else if (url.includes("timeout")) {
        setError("Connection failed: Request timeout");
      } else {
        setMessage("Database configuration saved and tables initialized successfully!");
      }
      setIsTestingConnection(false);
    }, 2000);
  };

  const handleClear = async () => {
    setUrl("");
    setAuthToken("");
    setMessage("Configuration cleared.");
    setError("");
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

const meta = {
  title: "Pages/Config",
  component: MockConfigPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MockConfigPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithExistingConfig: Story = {
  args: {
    initialUrl: "http://localhost:10801",
    initialAuthToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  },
};

export const WithSuccessMessage: Story = {
  args: {
    initialUrl: "http://localhost:10801",
    initialMessage: "Database configuration saved and tables initialized successfully!",
  },
};

export const WithError: Story = {
  args: {
    initialUrl: "http://invalid-url:8080",
    initialError: "Connection failed: Invalid database URL",
  },
};

export const EmptyConfiguration: Story = {
  args: {
    initialUrl: "",
    initialAuthToken: "",
  },
};
