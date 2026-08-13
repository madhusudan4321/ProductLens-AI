import { apiFetch } from "./api";

// ─── Types ───────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
  };
}

// ─── Auth API Functions ──────────────────────────────────

export async function apiRegister(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const res = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  return res.data.user;
}

export async function apiLogin(
  email: string,
  password: string
): Promise<User> {
  const res = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.data.user;
}

export async function apiLogout(): Promise<void> {
  await apiFetch<{ success: boolean }>("/auth/logout", {
    method: "POST",
  });
}

export async function apiGetMe(): Promise<User> {
  const res = await apiFetch<AuthResponse>("/auth/me");
  return res.data.user;
}

export async function apiRefresh(): Promise<User> {
  const res = await apiFetch<AuthResponse>("/auth/refresh", {
    method: "POST",
  });
  return res.data.user;
}
