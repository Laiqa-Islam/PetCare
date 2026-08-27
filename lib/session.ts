import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "./models";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "development-only-session-secret",
);

export type SessionPayload = {
  userId: string;
  role: UserRole;
  name: string;
};

export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  (await cookies()).set("furshield_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get("furshield_session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: String(payload.userId),
      role: payload.role as UserRole,
      name: String(payload.name),
    };
  } catch {
    return null;
  }
}

export async function requireSession(roles?: UserRole[]) {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");
  if (roles && !roles.includes(session.role)) redirect("/dashboard");
  return session;
}

export async function deleteSession() {
  (await cookies()).delete("furshield_session");
}
