"use client";

import { handleDeleteVote } from "@/lib/vote-delete-action";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {isDeleted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">削除しました</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-base py-4">
              投票の削除が完了しました。
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
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
            <DialogHeader>
              <DialogTitle className="text-xl">
                投票を削除しますか？
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-base py-4">
              投票を削除すると、元に戻すことはできません。本当に削除してもよろしいですか？
            </DialogDescription>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  キャンセル
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                disabled={isDeleteButtonPressed}
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
                {isDeleteButtonPressed ? "削除中..." : "削除する"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
