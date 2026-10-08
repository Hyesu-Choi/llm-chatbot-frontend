import { useState, type FormEvent } from "react";
import { AuthHeader } from "./AuthHeader";
import { signup } from "./authApi";
import { useAuthStore } from "./authStore";
import { SubmitButton } from "./SubmitButton";
import { TextField } from "./TextField";
import { PASSWORD_MIN_LENGTH, validateEmail, validateNewPassword } from "./validation";

type Props = {
  onSwitchToLogin: () => void;
};

export function SignupForm({ onSwitchToLogin }: Props) {
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // touched: 한 번이라도 입력하고 다른 곳으로 나갔는지(blur).
  // 타이핑 첫 글자부터 빨간 오류를 띄우면 불편해서, 다 쓰고 나간 뒤에만 보여준다.
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 두 필드는 서로 영향을 주지 않으니 필드마다 따로 검사한다
  const emailError = validateEmail(email);
  const passwordError = validateNewPassword(password);
  const isValid = emailError === null && passwordError === null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setServerError(null);
    try {
      // 가입에 성공하면 서버가 바로 로그인 쿠키까지 내려준다
      setUser(await signup({ email, password }));
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "가입에 실패했어요");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <AuthHeader
        title={"처음 오셨군요\n계정을 만들어 볼게요"}
        description={`비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상으로 정해 주세요`}
      />

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
          onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
          // "이미 가입된 이메일입니다" 같은 서버 오류도 이메일 칸 아래에 보여준다
          error={(touched.email ? emailError : null) ?? serverError}
        />
        <TextField
          label="비밀번호"
          type="password"
          autoComplete="new-password"
          placeholder={`${PASSWORD_MIN_LENGTH}자 이상`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
          error={touched.password ? passwordError : null}
        />
      </div>

      <div className="flex-1" />

      <div className="flex flex-col gap-4 pt-8">
        <SubmitButton disabled={!isValid} loading={submitting}>
          가입하기
        </SubmitButton>
        <p className="text-center text-[14px] text-muted-foreground">
          이미 계정이 있나요?{" "}
          <button type="button" onClick={onSwitchToLogin} className="font-semibold text-primary">
            로그인
          </button>
        </p>
      </div>
    </form>
  );
}
