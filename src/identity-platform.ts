import { jwtVerify, type JWTVerifyGetKey } from 'jose';
import type { Authenticator } from './auth.ts';

function userIdFromProviderUid(uid: string): string {
  return `idp:${uid}`;
}

export function createIdentityPlatformAuthenticator(
  projectId: string,
  keys: JWTVerifyGetKey,
): Authenticator {
  return async (authorization) => {
    const token = authorization?.match(/^Bearer (.+)$/)?.[1];
    if (token === undefined) {
      return null;
    }
    try {
      const { payload } = await jwtVerify(token, keys, {
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
        algorithms: ['RS256'],
      });
      return payload.sub ? userIdFromProviderUid(payload.sub) : null;
    } catch {
      return null;
    }
  };
}
