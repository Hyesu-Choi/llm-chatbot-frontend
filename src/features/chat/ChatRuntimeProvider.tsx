import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  useRemoteThreadListRuntime,
} from "@assistant-ui/react";
import type { ReactNode } from "react";
import { chatModelAdapter } from "./chatModelAdapter";
import { conversationListAdapter } from "./conversationListAdapter";

// assistant-ui 구조 한눈에 보기:
//   런타임(runtime) = 대화 목록, 메시지, 전송·중지 같은 "상태와 동작"을 관리하는 두뇌
//   어댑터(adapter) = 런타임이 "답변 좀 받아와"라고 할 때 실제로 서버를 부르는 부분 (chatModelAdapter.ts)
//   UI 컴포넌트(Thread, ThreadList 등) = 런타임 상태를 읽어 화면에 그리기만 함
//
// useRemoteThreadListRuntime: 대화 목록과 메시지를 서버(/api/conversations)에 저장하는 런타임.
// 대화마다 useChatThreadRuntime으로 런타임을 하나씩 만들고, 저장 · 불러오기는 conversationListAdapter가 맡는다.
function useChatThreadRuntime() {
  return useLocalRuntime(chatModelAdapter);
}

export function ChatRuntimeProvider({ children }: { children: ReactNode }) {
  const runtime = useRemoteThreadListRuntime({
    runtimeHook: useChatThreadRuntime,
    adapter: conversationListAdapter,
  });
  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>;
}
