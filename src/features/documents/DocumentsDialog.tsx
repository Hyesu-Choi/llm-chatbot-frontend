import { Loader2Icon, UploadIcon } from "lucide-react";
import { useRef, useState, type ChangeEvent, type ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ACCEPTED_EXTENSIONS,
  deleteDocument,
  listDocuments,
  uploadDocument,
  type DocumentItem,
} from "./documentApi";
import { DocumentRow } from "./DocumentRow";

type Props = {
  trigger: ReactElement;
};

export function DocumentsDialog({ trigger }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<DocumentItem[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    listDocuments()
      .then(setDocuments)
      .catch((e: Error) => setError(e.message));
  }

  function handleOpenChange(open: boolean) {
    if (!open) return;
    setError(null);
    refresh();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      await uploadDocument(file);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "문서를 올리지 못했어요");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    setDocuments((prev) => prev?.filter((document) => document.id !== id) ?? null);
    await deleteDocument(id).catch((e: Error) => {
      setError(e.message);
      refresh();
    });
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="gap-6 rounded-3xl p-6 sm:max-w-md">
        <div className="flex flex-col gap-2 pr-6">
          <DialogTitle className="text-[22px] leading-snug font-bold">내 문서</DialogTitle>
          <DialogDescription className="text-[15px] leading-relaxed">
            올린 문서에서 질문과 관련된 내용을 찾아 답변에 참고해요. 텍스트(.txt)와 마크다운(.md)
            파일을 올릴 수 있어요.
          </DialogDescription>
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={fileInput}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
            className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-toss-blue-light text-[16px] font-semibold text-toss-blue-dark transition active:scale-[0.98] disabled:opacity-70"
          >
            {uploading ? (
              <>
                <Loader2Icon className="size-5 animate-spin" />
                문서를 읽는 중이에요
              </>
            ) : (
              <>
                <UploadIcon className="size-5" />
                문서 올리기
              </>
            )}
          </button>
          {error && (
            <p role="alert" className="text-[13px] text-destructive">
              {error}
            </p>
          )}
        </div>

        <DocumentList documents={documents} onDelete={handleDelete} />
      </DialogContent>
    </Dialog>
  );
}

function DocumentList({
  documents,
  onDelete,
}: {
  documents: DocumentItem[] | null;
  onDelete: (id: string) => void;
}) {
  if (documents === null) {
    return <Loader2Icon className="mx-auto size-5 animate-spin text-muted-foreground" />;
  }
  if (documents.length === 0) {
    return (
      <p className="py-6 text-center text-[15px] text-muted-foreground">아직 올린 문서가 없어요</p>
    );
  }
  return (
    <ul className="-my-2.5 max-h-[45vh] overflow-y-auto">
      {documents.map((document) => (
        <DocumentRow key={document.id} document={document} onDelete={onDelete} />
      ))}
    </ul>
  );
}
