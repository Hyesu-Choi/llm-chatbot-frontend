import { ThreadList } from "@/components/assistant-ui/elements/thread-list.aui";
import { Thread } from "@/components/assistant-ui/elements/thread.aui";
import { AssistantMark } from "@/components/AssistantMark";
import { LogoutIconButton, UserMenu } from "@/features/auth/UserMenu";
import { DocumentsIconButton, DocumentsSidebarButton } from "@/features/documents/DocumentsButtons";
import { ChatRuntimeProvider } from "./ChatRuntimeProvider";
import { ModelSelect } from "./ModelSelect";
import { PersonaSelect } from "./PersonaSelect";
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
          <div className="flex flex-col gap-2">
            <DocumentsSidebarButton />
            <UserMenu />
          </div>
        </aside>
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between gap-3 pr-3 pl-5 md:justify-start md:px-6">
            <AssistantMark className="size-8 md:hidden" />
            <div className="flex min-w-0 items-center gap-1.5">
              <PersonaSelect />
              <ModelSelect />
              <div className="flex md:hidden">
                <DocumentsIconButton />
                <LogoutIconButton />
              </div>
            </div>
          </header>
          <Thread components={THREAD_COMPONENTS} />
        </section>
      </main>
    </ChatRuntimeProvider>
  );
}

function ChatBrand() {
  return (
    <div className="flex shrink-0 items-center gap-2.5 px-1">
      <AssistantMark className="size-8" />
      <div className="leading-tight">
        <h1 className="text-[17px] font-bold whitespace-nowrap">AI 챗봇</h1>
        <p className="text-xs text-muted-foreground">Ollama</p>
      </div>
    </div>
  );
}
