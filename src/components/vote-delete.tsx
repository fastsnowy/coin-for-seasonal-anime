"use client";

import { handleDeleteVote } from "@/lib/vote-delete-action";
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
import { useState } from "react";

export const VoteDeleteButton = ({
  id,
}: {
  id: string;
}) => {
  const [isDeleteButtonPressed, setIsDeleteButtonPressed] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" type="button">
          投票を削除
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>投票を削除しますか？</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <DialogDescription>
          投票を削除すると、元に戻すことはできません。
        </DialogDescription>
        <DialogFooter>
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
            投票を削除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
