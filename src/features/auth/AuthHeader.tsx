import { AssistantMark } from "@/components/AssistantMark";

type Props = {
  title: string;
  description: string;
};

// 로그인 · 가입 화면 맨 위: 로고 + 두 줄짜리 큰 제목 + 회색 안내 문구 (토스 화면 상단 구성)
// title의 \n 은 whitespace-pre-line 덕분에 실제 줄바꿈으로 보인다
export function AuthHeader({ title, description }: Props) {
  return (
    <header className="flex flex-col gap-4">
      <AssistantMark className="size-12" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[26px] leading-snug font-bold tracking-tight whitespace-pre-line">
          {title}
        </h1>
        <p className="text-[15px] text-muted-foreground">{description}</p>
      </div>
    </header>
  );
}
