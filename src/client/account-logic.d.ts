export interface AccountLink {
  label: string;
  href: string;
  signedIn: boolean;
  hidden: boolean;
}

export function accountLink(input: {
  user: string | null;
  devUser: string | undefined;
  path: string;
}): AccountLink;

export type AccountView = 'dev' | 'unavailable' | 'sign-in' | 'signed-in';

export function accountView(input: {
  config: { apiKey?: string; devUser?: string };
  user: string | null;
}): AccountView;

export function safeNext(raw: string | null | undefined): string;

export function checkForm(input: {
  mode: 'signIn' | 'signUp' | 'reset';
  email: string;
  password: string;
}): string | null;

export interface ProgressRow {
  id: string;
  title: string;
  done: number;
  total: number;
  pct: number;
}

export function progressRows(
  courses: { id: string; title: string; total: number; exerciseIds: string[] }[],
  completed: Set<string>,
): ProgressRow[];
