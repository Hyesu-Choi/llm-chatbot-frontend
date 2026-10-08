import {
  ExportedMessageRepository,
  RuntimeAdapterProvider,
  useAui,
  type ExportedMessageRepositoryItem,
  type ThreadHistoryAdapter,
} from "@assistant-ui/react";
import { useMemo, type ReactNode } from "react";
import { listMessages, saveMessage } from "./conversationApi";
import { messageText } from "./messageText";

function useConversationHistory(): ThreadHistoryAdapter {
  const aui = useAui();

  return useMemo(() => {
    async function persist({ message, parentId }: ExportedMessageRepositoryItem) {
      if (message.role !== "user" && message.role !== "assistant") return;
      const { remoteId } = await aui.threadListItem.initialize();
      await saveMessage(remoteId, message.id, {
        parent_message_id: parentId,
        role: message.role,
        content: messageText(message),
      });
    }

    return {
      async load() {
        const { remoteId } = aui.threadListItem.getState();
        if (!remoteId) return { messages: [] };

        const stored = await listMessages(remoteId);
        return ExportedMessageRepository.fromBranchableArray(
          stored.map((message) => ({
            parentId: message.parent_message_id,
            message: {
              id: message.message_id,
              role: message.role,
              content: message.content,
              createdAt: new Date(message.created_at),
            },
          })),
          { headId: stored.at(-1)?.message_id ?? null },
        );
      },
      append: persist,
      update: persist,
    };
  }, [aui]);
}

export function ConversationHistoryProvider({ children }: { children?: ReactNode }) {
  const history = useConversationHistory();
  const adapters = useMemo(() => ({ history }), [history]);
  return <RuntimeAdapterProvider adapters={adapters}>{children}</RuntimeAdapterProvider>;
}
