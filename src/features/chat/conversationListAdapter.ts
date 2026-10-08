import type { RemoteThreadListAdapter, ThreadMessage } from "@assistant-ui/react";
import { createAssistantStream } from "assistant-stream";
import { ConversationHistoryProvider } from "./ConversationHistoryProvider";
import {
  createConversation,
  deleteConversation,
  generateConversationTitle,
  getConversation,
  listConversations,
  updateConversation,
  type Conversation,
} from "./conversationApi";
import { messageText } from "./messageText";

const FALLBACK_TITLE = "새 대화";

function toThreadMetadata(conversation: Conversation) {
  return {
    remoteId: conversation.id,
    status: conversation.archived ? "archived" : "regular",
    title: conversation.title ?? undefined,
    lastMessageAt: new Date(conversation.updated_at),
  } as const;
}

function firstQuestionText(messages: readonly ThreadMessage[]): string {
  const firstQuestion = messages.find((message) => message.role === "user");
  return firstQuestion ? messageText(firstQuestion).trim() : "";
}

async function saveTitle(remoteId: string, messages: readonly ThreadMessage[]): Promise<string> {
  const question = firstQuestionText(messages);
  const conversation =
    question === ""
      ? await updateConversation(remoteId, { title: FALLBACK_TITLE })
      : await generateConversationTitle(remoteId, question);
  return conversation.title ?? FALLBACK_TITLE;
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
    return createAssistantStream(async (controller) => {
      controller.appendText(await saveTitle(remoteId, messages));
    });
  },
  unstable_Provider: ConversationHistoryProvider,
};
