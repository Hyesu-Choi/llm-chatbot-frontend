import { FileTextIcon } from "lucide-react";
import { DocumentsDialog } from "./DocumentsDialog";

export function DocumentsSidebarButton() {
  return (
    <DocumentsDialog
      trigger={
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-medium transition hover:bg-muted"
        >
          <FileTextIcon className="size-5 text-muted-foreground" />
          내 문서
        </button>
      }
    />
  );
}

export function DocumentsIconButton() {
  return (
    <DocumentsDialog
      trigger={
        <button
          type="button"
          aria-label="내 문서"
          className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <FileTextIcon className="size-5" />
        </button>
      }
    />
  );
}
