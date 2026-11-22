"use client";

import { handleDeleteVote } from "@/lib/vote-delete-action";
import { CircleCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function VoteDeleteDialog({
  id,
  open,
  onOpenChange,
}: {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isDeleteButtonPressed, setIsDeleteButtonPressed] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const isDeletingRef = useRef(false);
  const router = useRouter();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Keep the dialog open while the deletion is in flight.
        if (!next && isDeletingRef.current && !isDeleted) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        {isDeleted ? (
          <>
            <DialogHeader className="items-center sm:items-start">
              <span
                aria-hidden="true"
                className="mb-1 flex size-11 items-center justify-center rounded-full bg-success-muted text-success"
              >
                <CircleCheck className="size-5" />
              </span>
              <DialogTitle>削除しました</DialogTitle>
              <DialogDescription>投票の削除が完了しました。</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  onClick={() => {
                    router.push("/my-votes");
                  }}
                >
                  閉じる
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="items-center sm:items-start">
              <span
                aria-hidden="true"
                className="mb-1 flex size-11 items-center justify-center rounded-full bg-destructive-muted text-destructive"
              >
                <Trash2 className="size-5" />
              </span>
              <DialogTitle>投票を削除しますか？</DialogTitle>
              <DialogDescription>
                投票を削除すると、元に戻すことはできません。本当に削除してもよろしいですか？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  disabled={isDeleteButtonPressed}
                >
                  キャンセル
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                size="md"
                loading={isDeleteButtonPressed}
                icon={<Trash2 aria-hidden="true" />}
                onClick={async () => {
                  if (isDeleteButtonPressed || isDeletingRef.current) return;
                  setIsDeleteButtonPressed(true);
                  isDeletingRef.current = true;

                  try {
                    const success = await handleDeleteVote(id);
                    if (success) {
                      setIsDeleted(true);
                      router.refresh();
                    } else {
                      toast.error("削除に失敗しました");
                      setIsDeleteButtonPressed(false);
                      isDeletingRef.current = false;
                    }
                  } catch (error) {
                    console.error("削除エラー:", error);
                    toast.error("削除処理中にエラーが発生しました");
                    setIsDeleteButtonPressed(false);
                    isDeletingRef.current = false;
                  }
                }}
                type="button"
              >
                {isDeleteButtonPressed ? "削除中…" : "削除する"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
