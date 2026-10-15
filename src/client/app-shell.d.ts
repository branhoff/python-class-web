import type { Auth } from './auth.js';

export function repaint(): void;
export const ready: Promise<{ auth: Auth | null; config: { apiKey?: string; devUser?: string } }>;
export function authHeader(): Promise<Record<string, string>>;
