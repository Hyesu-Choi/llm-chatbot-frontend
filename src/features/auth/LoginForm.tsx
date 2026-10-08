import { useState, type FormEvent } from "react";
import { AuthHeader } from "./AuthHeader";
import { login } from "./authApi";
import { useAuthStore } from "./authStore";
import { SubmitButton } from "./SubmitButton";
import { TextField } from "./TextField";

type Props = {
  onSwitchToSignup: () => void;
};

export function LoginForm({ onSwitchToSignup }: Props) {
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 로그인은 형식 검사 없이 "둘 다 입력했는지"만 본다. 틀리면 서버가 알려준다.
  const isFilled = email.trim() !== "" && password !== "";

  async function handleSubmit(event: FormEvent) {
    // 기본 동작(페이지 새로고침하며 전송)을 막고 fetch로 직접 보낸다
    event.preventDefault();
    setSubmitting(true);
    setServerError(null);
    try {
      // 성공하면 authStore가 loggedIn이 되고, AuthGate가 이 화면 대신 채팅 화면을 그린다
      setUser(await login({ email, password }));
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "로그인에 실패했어요");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <AuthHeader title={"다시 만나서\n반가워요"} description="가입한 이메일로 로그인해 주세요" />

      <div className="mt-10 flex flex-col gap-7">
        <TextField
          label="이메일"
          type="email"
          autoComplete="username"
          placeholder="example@email.com"
          autoFocus
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setServerError(null);
          }}
        />
        <TextField
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setServerError(null);
          }}
          // "이메일 또는 비밀번호가 올바르지 않습니다" 같은 서버 오류는 마지막 칸 아래에 보여준다
          error={serverError}
        />
      </div>

      {/* flex-1 빈 공간이 버튼을 화면 아래로 밀어낸다 (토스의 하단 고정 버튼 느낌) */}
      <div className="flex-1" />

      <div className="flex flex-col gap-4 pt-8">
        <SubmitButton disabled={!isFilled} loading={submitting}>
          로그인
        </SubmitButton>
        <p className="text-center text-[14px] text-muted-foreground">
          아직 계정이 없나요?{" "}
          <button type="button" onClick={onSwitchToSignup} className="font-semibold text-primary">
            회원가입
          </button>
        </p>
      </div>
    </form>
  );
}
