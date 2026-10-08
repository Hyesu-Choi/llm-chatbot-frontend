import { Loader2Icon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  disabled: boolean;
  loading: boolean;
};

// 토스 스타일 하단 큰 버튼(CTA). 화면 너비를 꽉 채우고, 누르면 살짝 작아졌다 돌아온다.
// 입력이 다 안 됐을 땐(disabled) 흐린 파란색, 요청 중(loading)엔 진한 파란색 그대로 스피너만 돈다.
export function SubmitButton({ children, disabled, loading }: Props) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[17px] font-semibold text-primary-foreground transition",
        "hover:bg-toss-blue-dark active:scale-[0.98]",
        disabled && !loading && "bg-primary/35 hover:bg-primary/35",
      )}
    >
      {loading ? <Loader2Icon className="size-5 animate-spin" aria-label="처리 중" /> : children}
    </button>
  );
}
