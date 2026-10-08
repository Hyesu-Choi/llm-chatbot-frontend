import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthGate } from "@/features/auth/AuthGate";
import { ChatApp } from "@/features/chat/ChatApp";

// 앱 전체에 필요한 Provider를 감싸는 자리. 기능 코드는 features/ 아래에 둔다.
// AuthGate: 로그인 안 했으면 로그인 화면, 했으면 채팅 화면을 보여준다.
// TooltipProvider: shadcn 툴팁들이 공통 설정(나타나는 지연 시간 등)을 공유하게 해 준다.
// `@/` 는 src/ 의 별칭 (vite.config.ts, tsconfig의 paths 설정).
export function App() {
  return (
    <TooltipProvider>
      <AuthGate>
        <ChatApp />
      </AuthGate>
    </TooltipProvider>
  );
}
