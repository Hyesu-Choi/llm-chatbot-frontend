import { ThreadList } from "@/components/assistant-ui/elements/thread-list.aui";
import { Thread } from "@/components/assistant-ui/elements/thread.aui";
import { AssistantMark } from "@/components/AssistantMark";
import { LogoutIconButton, UserMenu } from "@/features/auth/UserMenu";
import { ChatRuntimeProvider } from "./ChatRuntimeProvider";
import { ThreadWelcome } from "./ThreadWelcome";

const THREAD_COMPONENTS = { Welcome: ThreadWelcome };

export function ChatApp() {
  return (
    <ChatRuntimeProvider>
      <main className="flex h-dvh bg-background">
        <aside className="hidden w-72 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar px-4 py-5 md:flex">
          <ChatBrand />
          {/* flex-1 + min-h-0: 대화 목록이 남은 높이를 채우고, 길어지면 이 안에서만 스크롤 → UserMenu는 항상 맨 아래 */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ThreadList />
          </div>
          <UserMenu />
        </aside>
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between pr-3 pl-5 md:hidden">
            <ChatBrand />
            <LogoutIconButton />
          </header>
          <Thread components={THREAD_COMPONENTS} />
        </section>
      </main>
    </ChatRuntimeProvider>
  );
}

function ChatBrand() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <AssistantMark className="size-8" />
      <div className="leading-tight">
        <h1 className="text-[17px] font-bold">AI 챗봇</h1>
        <p className="text-xs text-muted-foreground">Ollama</p>
      </div>
    </div>
  );
}
