import { z } from "zod";

export const DatabaseConfigSchema = z.object({
  url: z.string().url(),
  authToken: z.string().optional(),
});

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

function setLocalStorageItem(key: string, value: string): void {
  localStorage.setItem(key, value);
}

function getLocalStorageItem(key: string): string | null {
  return localStorage.getItem(key);
}

function removeLocalStorageItem(key: string): void {
  localStorage.removeItem(key);
}

export async function saveDatabaseConfig(config: DatabaseConfig): Promise<void> {
  setLocalStorageItem("turso_url", config.url);
  if (config.authToken) {
    setLocalStorageItem("turso_auth_token", config.authToken);
  } else {
    removeLocalStorageItem("turso_auth_token");
  }
}

export async function getDatabaseConfig(): Promise<DatabaseConfig | null> {
  const url = getLocalStorageItem("turso_url");
  if (!url) {
    return null;
  }

  const authToken = getLocalStorageItem("turso_auth_token");

  try {
    return DatabaseConfigSchema.parse({
      url,
      authToken: authToken || undefined,
    });
  } catch {
    return null;
  }
}

export async function clearDatabaseConfig(): Promise<void> {
  removeLocalStorageItem("turso_url");
  removeLocalStorageItem("turso_auth_token");
}
