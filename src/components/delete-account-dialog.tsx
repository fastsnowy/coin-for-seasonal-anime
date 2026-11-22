"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { TriangleAlert, UserX } from "lucide-react";
import { deleteAccount } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function isNextRedirectError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  if (!("digest" in error)) return false;
  return (
    typeof error.digest === "string" && error.digest.includes("NEXT_REDIRECT")
  );
}

export function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const confirmId = useId();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && isSubmitting) return;
        setOpen(next);
        if (!next) setConfirmed(false);
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="md"
          className="w-full border-destructive/30 text-destructive hover:bg-destructive-muted hover:text-destructive focus-visible:ring-destructive/25 sm:w-auto"
          icon={<UserX aria-hidden="true" />}
        >
          退会する
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center sm:items-start">
          <span
            aria-hidden="true"
            className="mb-1 flex size-11 items-center justify-center rounded-full bg-destructive-muted text-destructive"
          >
            <TriangleAlert className="size-5" />
          </span>
          <DialogTitle>退会しますか？</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3">
              <p>この操作は取り消せません。退会すると次のようになります。</p>
              <ul className="space-y-1.5 rounded-xl border border-border bg-surface-sunken px-4 py-3 text-left text-[13px] text-foreground/85">
                <li className="flex gap-2">
                  <span aria-hidden="true" className="text-destructive">
                    •
                  </span>
                  現在のアカウントでは投票履歴にアクセスできなくなります
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true" className="text-destructive">
                    •
                  </span>
                  投票データは匿名として保持されますが、再登録しても過去の投票履歴は引き継がれません
                </li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>

        <label
          htmlFor={confirmId}
          className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-border px-3.5 py-3 text-sm transition-colors has-checked:border-destructive/40 has-checked:bg-destructive-muted has-focus-visible:ring-[3px] has-focus-visible:ring-destructive/25"
        >
          <input
            id={confirmId}
            type="checkbox"
            checked={confirmed}
            disabled={isSubmitting}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-destructive outline-none"
          />
          <span className="leading-relaxed">
            上記の内容を理解し、退会します
          </span>
        </label>

        <DialogFooter className="mt-1">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              size="md"
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            size="md"
            disabled={!confirmed && !isSubmitting}
            loading={isSubmitting}
            onClick={async () => {
              if (isSubmitting || !confirmed) return;
              setIsSubmitting(true);

              try {
                const result = await deleteAccount();
                if (result?.error) {
                  toast.error(result.error);
                  setIsSubmitting(false);
                }
              } catch (error) {
                if (!isNextRedirectError(error)) {
                  toast.error("退会処理中にエラーが発生しました");
                  setIsSubmitting(false);
                }
              }
            }}
          >
            {isSubmitting ? "処理中…" : "退会する"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
