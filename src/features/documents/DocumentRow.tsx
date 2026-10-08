import { FileTextIcon, Trash2Icon } from "lucide-react";
import type { DocumentItem } from "./documentApi";

const dateFormat = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric" });
const numberFormat = new Intl.NumberFormat("ko-KR");

type Props = {
  document: DocumentItem;
  onDelete: (id: string) => void;
};

export function DocumentRow({ document, onDelete }: Props) {
  const meta = [
    `${numberFormat.format(document.char_count)}자`,
    `${document.chunk_count}조각`,
    dateFormat.format(new Date(document.created_at)),
  ].join(" · ");

  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileTextIcon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold">{document.filename}</span>
        <span className="block text-[13px] text-muted-foreground">{meta}</span>
      </span>
      <button
        type="button"
        onClick={() => onDelete(document.id)}
        aria-label={`${document.filename} 삭제`}
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-destructive"
      >
        <Trash2Icon className="size-4.5" />
      </button>
    </li>
  );
}
