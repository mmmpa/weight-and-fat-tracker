import { z } from "zod";

export const DatabaseConfigSchema = z.object({
  url: z.string().url(),
  authToken: z.string().optional(),
});

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

export function setCookie(name: string, value: string, days = 365): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

export function saveDatabaseConfig(config: DatabaseConfig): void {
  setCookie("turso_url", config.url);
  if (config.authToken) {
    setCookie("turso_auth_token", config.authToken);
  } else {
    deleteCookie("turso_auth_token");
  }
}

export function getDatabaseConfig(): DatabaseConfig | null {
  const url = getCookie("turso_url");
  if (!url) {
    return null;
  }

  const authToken = getCookie("turso_auth_token");

  try {
    return DatabaseConfigSchema.parse({
      url,
      authToken: authToken || undefined,
    });
  } catch {
    return null;
  }
}

export function clearDatabaseConfig(): void {
  deleteCookie("turso_url");
  deleteCookie("turso_auth_token");
}
