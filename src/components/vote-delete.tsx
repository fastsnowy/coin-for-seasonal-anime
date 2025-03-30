"use client";

import { handleDeleteVote } from "@/lib/vote-delete-action";
import { toast } from "sonner";
import { Button } from "./ui/button";

export const VoteDeleteButton = ({
  id,
}: {
  id: string;
}) => {
  return (
    <Button
      onClick={async () => {
        handleDeleteVote(id);
        toast.success("投票を削除しました");
      }}
      type="button"
    >
      投票を削除
    </Button>
  );
};
