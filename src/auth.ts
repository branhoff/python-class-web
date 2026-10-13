export type Authenticator = (authorization: string | undefined) => Promise<string | null>;
