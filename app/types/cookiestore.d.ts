interface CookieStoreSetOptions {
  name: string;
  value: string;
  expires?: number;
  path?: string;
  sameSite?: "strict" | "lax" | "none";
}

interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: number;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

interface CookieStore {
  get(name: string): Promise<Cookie | null>;
  set(options: CookieStoreSetOptions): Promise<void>;
  delete(name: string): Promise<void>;
}

interface Window {
  cookieStore: CookieStore;
}
