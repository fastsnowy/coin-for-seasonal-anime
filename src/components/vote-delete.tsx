"use client";

import { handleDeleteVote } from "@/lib/vote-delete-action";
import { useState } from "react";
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          type="button"
          className="shadow-lg hover:shadow-xl transition-all"
        >
          投票を削除
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">投票を削除しますか？</DialogTitle>
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
              setIsDeleteButtonPressed(true);
              handleDeleteVote(id);
              toast.success("投票を削除しました");
            }}
            type="button"
          >
            {isDeleteButtonPressed ? "削除中..." : "削除する"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
