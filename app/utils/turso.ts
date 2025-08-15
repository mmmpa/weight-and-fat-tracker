import type { Client } from "@libsql/client/web";
import { createClient } from "@libsql/client/web";
import { DatabaseNotConfiguredError } from "./errors";
import { getDatabaseConfig } from "./localStorage";

let tursoClient: Client | null = null;

export async function getTursoClient(): Promise<Client> {
  const config = await getDatabaseConfig();

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
  const turso = client || (await getTursoClient());

  try {
    // Create weight_records table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS weight_records (
        date DATE PRIMARY KEY NOT NULL,
        weight REAL NOT NULL CHECK (weight > 0 AND weight <= 500),
        fat_rate REAL NOT NULL CHECK (fat_rate >= 0 AND fat_rate <= 100)
      )
    `);
  } catch (error) {
    console.error("Failed to initialize tables:", error);
    throw new Error(
      `Table initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function resetDatabase(client?: Client): Promise<void> {
  const turso = client || (await getTursoClient());

  try {
    // Drop the table if it exists
    await turso.execute("DROP TABLE IF EXISTS weight_records");

    // Recreate the table
    await initializeTables(turso);
  } catch (error) {
    console.error("Failed to reset database:", error);
    throw new Error(
      `Database reset failed: ${error instanceof Error ? error.message : "Unknown error"}`
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
