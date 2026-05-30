import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-256-bit-secret-change-in-production'
);

export interface JWTPayload {
  sub: string;
  email: string;
  orgId: string;
  orgSlug: string;
  role: 'owner' | 'admin' | 'member';
  iat?: number;
  exp?: number;
}

export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const expirySeconds = 24 * 60 * 60; // 24 hours
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${expirySeconds}s`)
    .sign(secret);
  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as JWTPayload;
  } catch (err) {
    return null;
  }
}
