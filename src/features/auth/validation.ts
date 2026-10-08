// 백엔드 app/schemas.py 의 PASSWORD_MIN_LENGTH / PASSWORD_MAX_LENGTH 와 같은 값이어야 한다
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

// 완벽한 이메일 검사는 서버(email-validator)가 한다. 여기선 흔한 오타만 빨리 알려주는 용도.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 두 함수 모두 문제가 없으면 null, 있으면 화면에 보여줄 메시지를 돌려준다
export function validateEmail(email: string): string | null {
  return EMAIL_PATTERN.test(email.trim()) ? null : "이메일 형식을 확인해 주세요";
}

export function validateNewPassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `${PASSWORD_MIN_LENGTH}자 이상 입력해 주세요`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `${PASSWORD_MAX_LENGTH}자 이하로 입력해 주세요`;
  }
  return null;
}
