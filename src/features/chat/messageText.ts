import type { ThreadMessage } from "@assistant-ui/react";

export function messageText(message: ThreadMessage): string {
  return message.content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}
