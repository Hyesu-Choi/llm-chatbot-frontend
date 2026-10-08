import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"input"> & {
  label: string;
  error?: string | null;
};

// 토스 스타일 입력 필드: 위에 작은 라벨, 크고 굵은 입력 글자, 아래 밑줄만 있는 형태.
// 포커스되면 라벨과 밑줄이 파란색, 오류가 있으면 빨간색으로 바뀐다.
// 나머지 props(type, value, onChange, autoComplete 등)는 그대로 <input>에 넘긴다.
export function TextField({ label, error, className, ...inputProps }: Props) {
  const hasError = Boolean(error);

  return (
    // group: 자식에서 group-focus-within: 으로 "안의 input이 포커스됐을 때" 스타일을 줄 수 있다
    <label className="group flex flex-col gap-1.5">
      <span
        className={cn(
          "text-[13px] font-medium text-muted-foreground transition-colors group-focus-within:text-primary",
          hasError && "text-destructive group-focus-within:text-destructive",
        )}
      >
        {label}
      </span>
      <input
        aria-invalid={hasError}
        className={cn(
          "h-12 w-full border-b-2 border-border bg-transparent text-[20px] font-semibold text-foreground outline-none transition-colors",
          "placeholder:font-medium placeholder:text-muted-foreground/50 focus:border-primary",
          hasError && "border-destructive focus:border-destructive",
          className,
        )}
        {...inputProps}
      />
      {/* role="alert": 오류가 나타나면 스크린 리더가 바로 읽어 준다 */}
      {hasError && (
        <span role="alert" className="text-[13px] text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}
