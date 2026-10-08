import { requestJson } from "@/lib/apiClient";
import type { ChatRole } from "./types";

export type Conversation = {
  id: string;
  title: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

export type StoredMessage = {
  message_id: string;
  parent_message_id: string | null;
  role: ChatRole;
  content: string;
  created_at: string;
};

type ConversationPatch = { title?: string; archived?: boolean };
type MessageInput = Pick<StoredMessage, "parent_message_id" | "role" | "content">;

const BASE = "/api/conversations";

export function listConversations(): Promise<Conversation[]> {
  return requestJson("GET", BASE);
}

export function createConversation(): Promise<Conversation> {
  return requestJson("POST", BASE);
}

export function getConversation(id: string): Promise<Conversation> {
  return requestJson("GET", `${BASE}/${id}`);
}

export function updateConversation(id: string, patch: ConversationPatch): Promise<Conversation> {
  return requestJson("PATCH", `${BASE}/${id}`, patch);
}

export function deleteConversation(id: string): Promise<void> {
  return requestJson("DELETE", `${BASE}/${id}`);
}

export function listMessages(id: string): Promise<StoredMessage[]> {
  return requestJson("GET", `${BASE}/${id}/messages`);
}

export function saveMessage(
  id: string,
  messageId: string,
  message: MessageInput,
): Promise<StoredMessage> {
  return requestJson("PUT", `${BASE}/${id}/messages/${encodeURIComponent(messageId)}`, message);
}
