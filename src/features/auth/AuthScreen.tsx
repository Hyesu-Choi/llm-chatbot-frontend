import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

// 로그인 안 했을 때 보이는 화면. 로그인 ↔ 가입은 페이지 이동 없이 상태로만 바꾼다.
// 모바일에선 화면 전체, 넓은 화면에선 가운데 폰 너비(420px) 영역에 그린다.
export function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <main className="flex min-h-dvh justify-center bg-background">
      {/* pb의 env(safe-area-inset-bottom): 아이폰 하단 홈 바에 버튼이 가리지 않게 */}
      <div className="flex w-full max-w-[420px] flex-col px-6 pt-16 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pt-24 md:pb-24">
        {/* key를 바꾸면 React가 다른 폼으로 보고 새로 만든다 → 입력값 · 오류가 깨끗하게 초기화된다 */}
        {mode === "login" ? (
          <LoginForm key="login" onSwitchToSignup={() => setMode("signup")} />
        ) : (
          <SignupForm key="signup" onSwitchToLogin={() => setMode("login")} />
        )}
      </div>
    </main>
  );
}
