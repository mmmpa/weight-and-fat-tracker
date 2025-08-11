import type { Client } from "@libsql/client/web";
import { createClient } from "@libsql/client/web";
import { getDatabaseConfig } from "./cookies";
import { DatabaseNotConfiguredError } from "./errors";

let tursoClient: Client | null = null;

export function getTursoClient(): Client {
  const config = getDatabaseConfig();

  if (!config) {
    throw new DatabaseNotConfiguredError();
  }

  tursoClient = createClient({
    url: config.url,
    authToken: config.authToken,
  });

  return tursoClient;
}

export const DEFAULT_USER_ID = "default-user";

export async function initializeTables(client?: Client): Promise<void> {
  const turso = client || getTursoClient();

  try {
    // Create weight_records table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS weight_records (
        id TEXT PRIMARY KEY NOT NULL,
        date DATE NOT NULL,
        weight REAL NOT NULL CHECK (weight > 0 AND weight <= 500),
        fat_rate REAL NOT NULL CHECK (fat_rate >= 0 AND fat_rate <= 100)
      )
    `);

    // Create indexes
    await turso.execute(`
      CREATE INDEX IF NOT EXISTS idx_weight_records_date ON weight_records(date)
    `);

    await turso.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_weight_records_date_unique ON weight_records(date)
    `);
  } catch (error) {
    console.error("Failed to initialize tables:", error);
    throw new Error(
      `Table initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function testDatabaseConnection(url: string, authToken?: string): Promise<void> {
  const testClient = createClient({
    url,
    authToken,
  });

  try {
    // Test basic connection by querying SQLite version
    const result = await testClient.execute("SELECT sqlite_version() as version");

    if (!result.rows[0]) {
      throw new Error("Database connection test failed - no response");
    }

    // Initialize tables after successful connection
    await initializeTables(testClient);
  } catch (error) {
    throw new Error(
      `Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  } finally {
    testClient.close();
  }
}
