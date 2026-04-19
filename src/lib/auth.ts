import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "default-dev-secret-change-in-production-32+"
);
const COOKIE_NAME = "acomac_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

export type SessionPayload = {
  userId?: string;
  email?: string;
  role: "admin" | "editor";
};

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  return !!(await getSession());
}

export async function requireRole(role: "admin" | "editor"): Promise<boolean> {
  const s = await getSession();
  if (!s) return false;
  if (role === "editor") return true; // admin também é editor
  return s.role === "admin";
}

export function verifyEnvPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

export async function authenticateUser(
  emailOrUndefined: string | undefined,
  password: string
): Promise<SessionPayload | null> {
  // 1) Se email + senha batem com um usuário DB → OK
  if (emailOrUndefined) {
    const email = emailOrUndefined.trim().toLowerCase();
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      await prisma.adminUser.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
      return {
        userId: user.id,
        email: user.email,
        role: user.role === "admin" ? "admin" : "editor",
      };
    }
  }
  // 2) Senha ENV (superadmin via .env) — não exige email
  if (verifyEnvPassword(password)) {
    return {
      email: emailOrUndefined?.trim().toLowerCase() || "admin",
      role: "admin",
    };
  }
  return null;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
