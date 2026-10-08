import type { RemoteThreadListAdapter, ThreadMessage } from "@assistant-ui/react";
import { createAssistantStream } from "assistant-stream";
import { ConversationHistoryProvider } from "./ConversationHistoryProvider";
import {
  createConversation,
  deleteConversation,
  getConversation,
  listConversations,
  updateConversation,
  type Conversation,
} from "./conversationApi";
import { messageText } from "./messageText";

const TITLE_MAX_LENGTH = 30;
const FALLBACK_TITLE = "새 대화";

function toThreadMetadata(conversation: Conversation) {
  return {
    remoteId: conversation.id,
    status: conversation.archived ? "archived" : "regular",
    title: conversation.title ?? undefined,
    lastMessageAt: new Date(conversation.updated_at),
  } as const;
}

function titleFrom(messages: readonly ThreadMessage[]): string {
  const firstQuestion = messages.find((message) => message.role === "user");
  const text = firstQuestion ? messageText(firstQuestion).trim().replace(/\s+/g, " ") : "";
  if (text === "") return FALLBACK_TITLE;
  return text.length > TITLE_MAX_LENGTH ? `${text.slice(0, TITLE_MAX_LENGTH)}…` : text;
}

export const conversationListAdapter: RemoteThreadListAdapter = {
  async list() {
    const conversations = await listConversations();
    return { threads: conversations.map(toThreadMetadata) };
  },
  async initialize() {
    const conversation = await createConversation();
    return { remoteId: conversation.id };
  },
  async fetch(remoteId) {
    return toThreadMetadata(await getConversation(remoteId));
  },
  async rename(remoteId, title) {
    await updateConversation(remoteId, { title });
  },
  async archive(remoteId) {
    await updateConversation(remoteId, { archived: true });
  },
  async unarchive(remoteId) {
    await updateConversation(remoteId, { archived: false });
  },
  async delete(remoteId) {
    await deleteConversation(remoteId);
  },
  async generateTitle(remoteId, messages) {
    const title = titleFrom(messages);
    return createAssistantStream(async (controller) => {
      await updateConversation(remoteId, { title });
      controller.appendText(title);
    });
  },
  unstable_Provider: ConversationHistoryProvider,
};
