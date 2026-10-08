type RagSource = {
  filename: string;
  chunk: number;
};

export const RAG_SOURCES_HEADER = "X-RAG-Sources";

export function parseRagSources(header: string | null): RagSource[] {
  if (!header) return [];
  try {
    return JSON.parse(decodeURIComponent(header));
  } catch {
    return [];
  }
}

export function formatRagSources(sources: RagSource[]): string {
  const items = sources.map((source, index) => `[${index + 1}] ${source.filename} (조각 ${source.chunk})`);
  return `\n\n---\n📎 **참고한 문서** · ${items.join(" · ")}`;
}
