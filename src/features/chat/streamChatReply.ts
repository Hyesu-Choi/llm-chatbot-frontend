import { toApiError } from "@/lib/apiClient";
import type { ChatMessage } from "./types";

// 백엔드 POST /api/chat 을 호출하고, 응답 본문이 도착하는 대로 텍스트 조각을 하나씩 내보낸다.
// "/api/chat" 은 상대 경로라서 개발 중엔 Vite 프록시가 localhost:8000 으로 넘겨준다 (vite.config.ts).
export async function* streamChatReply(
  messages: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    // signal이 abort 되면 fetch와 아래 reader.read()가 AbortError로 즉시 끝난다
    signal,
  });

  // 백엔드 오류는 {"error": "..."} JSON으로 온다 (app/routers/chat.py).
  // 프록시 오류처럼 JSON이 아닌 응답이면 .json()이 실패하므로 catch로 대체 메시지를 만든다.
  // 여기서 throw 하면 assistant-ui가 받아서 말풍선에 오류를 표시한다.
  // 백엔드 오류는 {"error": "..."} JSON으로 온다. 401이면 UnauthorizedError가 되어
  // chatModelAdapter가 로그인 화면으로 보낼 수 있다 (lib/apiClient.ts).
  if (!response.ok || !response.body) {
    throw await toApiError(response);
  }

  // response.body는 ReadableStream. reader로 도착한 바이트 덩어리(Uint8Array)를 하나씩 읽는다.
  // response.text()를 쓰면 답변이 끝날 때까지 기다려야 해서 스트리밍 효과가 사라진다.
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    // 한글은 UTF-8에서 3바이트라 한 글자가 두 덩어리에 걸쳐 올 수 있다.
    // { stream: true } 면 끝이 잘린 바이트는 디코더가 들고 있다가 다음 덩어리와 합쳐서 디코딩한다.
    yield decoder.decode(value, { stream: true });
  }

  // 마지막 조각이 멀티바이트 문자 중간에서 끊겼을 때 남은 바이트를 흘려보낸다
  const rest = decoder.decode();
  if (rest) yield rest;
}
