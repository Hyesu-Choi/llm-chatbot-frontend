import { ThreadList } from "@/components/assistant-ui/elements/thread-list.aui";
import { Thread } from "@/components/assistant-ui/elements/thread.aui";
import { AssistantMark } from "./AssistantMark";
import { ChatRuntimeProvider } from "./ChatRuntimeProvider";
import { ThreadWelcome } from "./ThreadWelcome";

const THREAD_COMPONENTS = { Welcome: ThreadWelcome };

export function ChatApp() {
  return (
    <ChatRuntimeProvider>
      <main className="flex h-dvh bg-background">
        <aside className="hidden w-72 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar px-4 py-5 md:flex">
          <ChatBrand />
          <ThreadList />
        </aside>
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center px-5 md:hidden">
            <ChatBrand />
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
