import { z } from "zod";

export const DatabaseConfigSchema = z.object({
  url: z.string().url(),
  authToken: z.string().optional(),
});

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

export async function setCookie(name: string, value: string, days = 365): Promise<void> {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  await window.cookieStore.set({
    name,
    value: encodeURIComponent(value),
    expires: expires.getTime(),
    path: "/",
    sameSite: "strict",
  });
}

export async function getCookie(name: string): Promise<string | null> {
  const cookie = await window.cookieStore.get(name);
  return cookie ? decodeURIComponent(cookie.value) : null;
}

export async function deleteCookie(name: string): Promise<void> {
  await window.cookieStore.delete(name);
}

export async function saveDatabaseConfig(config: DatabaseConfig): Promise<void> {
  await setCookie("turso_url", config.url);
  if (config.authToken) {
    await setCookie("turso_auth_token", config.authToken);
  } else {
    await deleteCookie("turso_auth_token");
  }
}

export async function getDatabaseConfig(): Promise<DatabaseConfig | null> {
  const url = await getCookie("turso_url");
  if (!url) {
    return null;
  }

  const authToken = await getCookie("turso_auth_token");

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
  await deleteCookie("turso_url");
  await deleteCookie("turso_auth_token");
}
