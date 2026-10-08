import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react";
import type { ReactNode } from "react";
import { chatModelAdapter } from "./chatModelAdapter";

// assistant-ui 구조 한눈에 보기:
//   런타임(runtime) = 대화 목록, 메시지, 전송·중지 같은 "상태와 동작"을 관리하는 두뇌
//   어댑터(adapter) = 런타임이 "답변 좀 받아와"라고 할 때 실제로 서버를 부르는 부분 (chatModelAdapter.ts)
//   UI 컴포넌트(Thread, ThreadList 등) = 런타임 상태를 읽어 화면에 그리기만 함
//
// useLocalRuntime: 대화 상태를 브라우저 메모리에 들고 있는 런타임. 새로고침하면 대화가 사라진다.
// Provider로 감싸면 그 안의 모든 assistant-ui 컴포넌트가 이 런타임을 Context로 꺼내 쓴다.
export function ChatRuntimeProvider({ children }: { children: ReactNode }) {
  const runtime = useLocalRuntime(chatModelAdapter);
  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>;
}
