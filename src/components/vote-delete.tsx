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
  DialogTrigger,
} from "./ui/dialog";

export const VoteDeleteButton = ({
  id,
}: {
  id: string;
}) => {
  const [isDeleteButtonPressed, setIsDeleteButtonPressed] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const isDeletingRef = useRef(false);
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          type="button"
          className="shadow-lg hover:shadow-xl transition-all"
          disabled={isDeleted || isDeleteButtonPressed}
        >
          {isDeleted ? "削除済み" : "投票を削除"}
        </Button>
      </DialogTrigger>
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
                    router.push("/");
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
              <DialogClose />
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
                    // localStorageから投票情報を削除
                    const myVotes = JSON.parse(
                      localStorage.getItem("myVotes") || "{}",
                    );
                    delete myVotes[id];
                    localStorage.setItem("myVotes", JSON.stringify(myVotes));

                    const success = await handleDeleteVote(id);
                    if (success) {
                      setIsDeleted(true);
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
};
