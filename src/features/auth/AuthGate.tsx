import { useEffect, type ReactNode } from "react";
import { AssistantMark } from "@/components/AssistantMark";
import { fetchMe } from "./authApi";
import { AuthScreen } from "./AuthScreen";
import { useAuthStore } from "./authStore";

// 로그인한 사람에게만 children(채팅 화면)을 보여주는 문지기.
// 로그아웃하면 children이 화면에서 빠지면서 채팅 상태도 같이 사라진다 → 다른 계정으로 로그인해도 이전 대화가 안 남는다.
export function AuthGate({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  // 앱을 열 때 한 번, 쿠키가 아직 유효한지 서버에 물어본다 (새로고침해도 로그인 유지되는 원리)
  useEffect(() => {
    fetchMe()
      .then((user) => (user ? setUser(user) : clearUser()))
      // 백엔드가 꺼져 있는 등 확인 자체가 실패하면 로그인 화면으로 (로그인 시도 때 오류 메시지가 보인다)
      .catch(clearUser);
  }, [setUser, clearUser]);

  if (status === "checking") {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <AssistantMark className="size-12 animate-pulse" />
      </div>
    );
  }
  if (status === "loggedOut") {
    return <AuthScreen />;
  }
  return children;
}
