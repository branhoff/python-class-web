export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type FetchLike = (
  url: string,
  init?: { method?: string; headers?: Record<string, string>; body?: string },
) => Promise<{ ok: boolean; json(): Promise<unknown> }>;

export interface AuthDeps {
  apiKey: string;
  fetch: FetchLike;
  storage: Storage;
  now?: () => number;
  identityUrl?: string;
  tokenUrl?: string;
}

export interface Auth {
  signIn(email: string, password: string): Promise<string>;
  signUp(email: string, password: string): Promise<string>;
  resetPassword(email: string): Promise<void>;
  getToken(): Promise<string | null>;
  signOut(): void;
  currentUser(): string | null;
}

export function createAuth(deps: AuthDeps): Auth;

export function describeAuthError(error: unknown): string;
