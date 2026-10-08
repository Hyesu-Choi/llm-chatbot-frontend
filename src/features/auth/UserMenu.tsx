import { LogOutIcon } from "lucide-react";
import { useAuthStore } from "./authStore";

// 사이드바 맨 아래: 이메일 첫 글자 동그라미 + 이메일 + 로그아웃 (넓은 화면용)
export function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  if (user === null) return null;

  return (
    <div className="flex items-center gap-3 px-1">
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-[15px] font-semibold text-secondary-foreground"
      >
        {user.email[0].toUpperCase()}
      </span>
      <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{user.email}</span>
      <button
        type="button"
        onClick={signOut}
        className="shrink-0 rounded-lg px-2 py-1 text-[13px] text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        로그아웃
      </button>
    </div>
  );
}

// 좁은 화면 상단 헤더 오른쪽에 들어가는 아이콘 버튼 (사이드바가 숨겨지는 모바일용)
export function LogoutIconButton() {
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <button
      type="button"
      onClick={signOut}
      aria-label="로그아웃"
      className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      <LogOutIcon className="size-5" />
    </button>
  );
}
