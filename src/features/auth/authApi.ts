import type { Credentials, User } from "./types";

// 로그인이 풀렸을 때(쿠키 없음 · 만료) 던지는 오류. 받는 쪽이 instanceof로 골라 로그인 화면으로 보낸다.
export class UnauthorizedError extends Error {}

// 로그인 토큰은 httpOnly 쿠키라 자바스크립트에서 읽거나 붙일 필요가 없다.
// 같은 출처(/api, Vite 프록시)로 보내는 fetch는 브라우저가 쿠키를 자동으로 함께 보낸다.
async function postJson<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    throw await toError(response);
  }
  // 204 No Content(로그아웃)는 본문이 없어서 .json()을 부르면 실패한다
  return (response.status === 204 ? undefined : await response.json()) as T;
}

// 백엔드 오류는 모두 {"error": "..."} 모양이다 (app/main.py 예외 처리기)
async function toError(response: Response): Promise<Error> {
  const { error } = await response
    .json()
    .catch(() => ({ error: `요청에 실패했어요 (${response.status})` }));
  return response.status === 401 ? new UnauthorizedError(error) : new Error(error);
}

/** 지금 로그인된 사용자. 로그인 안 돼 있으면 null. */
export async function fetchMe(): Promise<User | null> {
  const response = await fetch("/api/auth/me");
  if (response.status === 401) return null;
  if (!response.ok) throw await toError(response);
  return response.json();
}

export function login(credentials: Credentials): Promise<User> {
  return postJson("/api/auth/login", credentials);
}

export function signup(credentials: Credentials): Promise<User> {
  return postJson("/api/auth/signup", credentials);
}

export function logout(): Promise<void> {
  return postJson("/api/auth/logout");
}
