import { ThreadPrimitive } from "@assistant-ui/react";
import { ChevronRightIcon } from "lucide-react";
import { AssistantMark } from "@/components/AssistantMark";

// 대화 시작 전 화면에 보여줄 추천 질문. 항목을 추가·수정하면 바로 화면에 반영된다.
const SUGGESTIONS = [
  { emoji: "✍️", title: "글 다듬기", prompt: "이 문장을 더 자연스럽게 고쳐줘" },
  { emoji: "💡", title: "아이디어 내기", prompt: "주말에 할 만한 취미 5가지 추천해줘" },
  { emoji: "📚", title: "설명 듣기", prompt: "React의 useEffect를 쉽게 설명해줘" },
  { emoji: "📝", title: "요약하기", prompt: "긴 글을 세 줄로 요약해줘" },
];

// 대화가 비어 있을 때만 보이는 환영 화면. ChatApp.tsx에서 Thread의 Welcome 자리에 끼워 넣는다.
export function ThreadWelcome() {
  return (
    <div className="mb-6 flex flex-col gap-8">
      <div className="flex flex-col gap-4 px-2">
        <AssistantMark className="size-12" />
        <div className="flex flex-col gap-2">
          <h2 className="text-[26px] leading-snug font-bold tracking-tight">
            무엇을
            <br />
            도와드릴까요?
          </h2>
          <p className="text-[15px] text-muted-foreground">
            아래에서 골라보거나 직접 질문을 입력해 보세요
          </p>
        </div>
      </div>
      <ul className="flex flex-col">
        {SUGGESTIONS.map((suggestion) => (
          <li key={suggestion.title}>
            <ThreadPrimitive.Suggestion
              prompt={suggestion.prompt}
              send
              className="group flex w-full items-center gap-4 rounded-2xl px-2 py-3 text-left transition hover:bg-muted active:scale-[0.98]"
            >
              <span
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-xl transition group-hover:bg-background"
              >
                {suggestion.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{suggestion.title}</span>
                <span className="block truncate text-sm text-muted-foreground">
                  {suggestion.prompt}
                </span>
              </span>
              <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground/50" />
            </ThreadPrimitive.Suggestion>
          </li>
        ))}
      </ul>
    </div>
  );
}
