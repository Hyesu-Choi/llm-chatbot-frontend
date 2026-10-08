export class UnauthorizedError extends Error {}

export async function toApiError(response: Response): Promise<Error> {
  const { error } = await response
    .json()
    .catch(() => ({ error: `요청에 실패했어요 (${response.status})` }));
  return response.status === 401 ? new UnauthorizedError(error) : new Error(error);
}

export async function requestJson<T>(method: string, path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    throw await toApiError(response);
  }
  return (response.status === 204 ? undefined : await response.json()) as T;
}
