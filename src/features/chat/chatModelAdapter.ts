import type { ChatModelAdapter, ThreadMessage } from "@assistant-ui/react";
import { useAuthStore } from "@/features/auth/authStore";
import { UnauthorizedError } from "@/lib/apiClient";
import { messageText } from "./messageText";
import { useModelStore } from "./modelStore";
import { streamChatReply } from "./streamChatReply";
import type { ChatMessage } from "./types";

// 사용자가 메시지를 보내면 assistant-ui 런타임이 run()을 호출한다.
// messages: 지금까지의 대화 전체 (방금 보낸 메시지 포함)
// abortSignal: 사용자가 '중지' 버튼을 누르면 abort 되는 신호. fetch까지 전달해서 요청을 끊는다.
//
// `async *run` 은 비동기 제너레이터 함수. yield 할 때마다 화면의 답변 말풍선이 갱신된다.
// assistant-ui는 매 yield마다 "지금까지의 전체 내용"을 기대한다 (델타가 아님)
// 그래서 받은 조각을 text에 계속 이어 붙이고, 누적된 전체를 매번 넘긴다.
export const chatModelAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal }) {
    let text = "";
    try {
      const { selectedModel } = useModelStore.getState();
      const chatMessages = toChatMessages(messages);
      for await (const chunk of streamChatReply(chatMessages, selectedModel, abortSignal)) {
        text += chunk;
        yield { content: [{ type: "text", text }] };
      }
    } catch (error) {
      // 대화 도중 로그인이 만료되면 로그인 화면으로 돌려보낸다.
      // getState(): 컴포넌트 밖(이 어댑터)에서 zustand 상태 · 함수를 꺼내 쓰는 방법
      if (error instanceof UnauthorizedError) {
        useAuthStore.getState().clearUser();
      }
      throw error;
    }
  },
};

// assistant-ui의 메시지 모양을 백엔드가 받는 { role, content } 모양으로 바꾼다.
// assistant-ui 메시지는 content가 여러 "파트"(텍스트, 이미지, 도구 호출 등)의 배열이라서
// 텍스트 파트만 골라 하나의 문자열로 합친다.
function toChatMessages(messages: readonly ThreadMessage[]): ChatMessage[] {
  return messages
    // system 같은 다른 role은 백엔드가 거부하므로(422) 미리 걸러낸다
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      // 위 filter로 role이 좁혀졌지만 TypeScript가 그걸 추론하지 못해서 as로 알려준다
      role: message.role as ChatMessage["role"],
      content: messageText(message),
    }))
    // 내용이 빈 메시지(예: 오류로 비어버린 답변)는 보내지 않는다
    .filter((message) => message.content.length > 0);
}
