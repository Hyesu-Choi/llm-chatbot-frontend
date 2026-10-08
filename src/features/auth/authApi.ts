import { requestJson, toApiError } from "@/lib/apiClient";
import type { Credentials, User } from "./types";

/** 지금 로그인된 사용자. 로그인 안 돼 있으면 null. */
export async function fetchMe(): Promise<User | null> {
  const response = await fetch("/api/auth/me");
  if (response.status === 401) return null;
  if (!response.ok) throw await toApiError(response);
  return response.json();
}

export function login(credentials: Credentials): Promise<User> {
  return requestJson("POST", "/api/auth/login", credentials);
}

export function signup(credentials: Credentials): Promise<User> {
  return requestJson("POST", "/api/auth/signup", credentials);
}

export function logout(): Promise<void> {
  return requestJson("POST", "/api/auth/logout");
}
