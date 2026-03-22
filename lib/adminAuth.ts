import { cookies } from "next/headers";

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "ruhullah";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "@Ruh1234";
const ADMIN_SESSION_COOKIE = "ruhullah_admin_session";
const ADMIN_SESSION_TOKEN =
  process.env.ADMIN_SESSION_TOKEN ?? `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;

export function areAdminCredentialsValid(username: string, password: string) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === ADMIN_SESSION_TOKEN;
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: ADMIN_SESSION_TOKEN,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
