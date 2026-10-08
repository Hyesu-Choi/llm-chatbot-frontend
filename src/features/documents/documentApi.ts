import { requestJson, toApiError } from "@/lib/apiClient";

export type DocumentItem = {
  id: string;
  filename: string;
  char_count: number;
  chunk_count: number;
  created_at: string;
};

export const ACCEPTED_EXTENSIONS = ".txt,.md";

export function listDocuments(): Promise<DocumentItem[]> {
  return requestJson("GET", "/api/documents");
}

export async function uploadDocument(file: File): Promise<DocumentItem> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch("/api/documents", { method: "POST", body: form });
  if (!response.ok) throw await toApiError(response);
  return response.json();
}

export function deleteDocument(id: string): Promise<void> {
  return requestJson("DELETE", `/api/documents/${id}`);
}
