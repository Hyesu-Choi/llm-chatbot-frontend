type ToolCall = {
  name: string;
  label: string;
  args: Record<string, unknown>;
  ok: boolean;
};

export const TOOL_CALLS_HEADER = "X-Tool-Calls";

export function parseToolCalls(header: string | null): ToolCall[] {
  if (!header) return [];
  try {
    return JSON.parse(decodeURIComponent(header));
  } catch {
    return [];
  }
}

function describeArgs(args: Record<string, unknown>): string {
  const value = args.city_original ?? args.city ?? args.expression;
  return typeof value === "string" && value !== "" ? ` · ${value}` : "";
}

export function formatToolCalls(calls: ToolCall[]): string {
  const lines = calls.map(
    (call) => `> 🔧 **${call.label}**${describeArgs(call.args)}${call.ok ? "" : " (실패)"}`,
  );
  return `${lines.join("\n")}\n\n`;
}

const TOOL_CALL_LINES = /^> 🔧 .*\n+/gm;

export function stripToolCalls(text: string): string {
  return text.replace(TOOL_CALL_LINES, "");
}
