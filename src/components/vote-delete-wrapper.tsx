"use client";

import { useSyncExternalStore } from "react";
import { VoteDeleteButton } from "./vote-delete";

interface VoteDeleteWrapperProps {
  voteId: string;
  deleteId: string;
}

export function VoteDeleteWrapper({ voteId, deleteId }: VoteDeleteWrapperProps) {
  const canDelete = useSyncExternalStore(
    (onStoreChange) => {
      const handler = () => onStoreChange();
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    () => {
      const myVotes = JSON.parse(localStorage.getItem("myVotes") || "{}");
      const voteInfo = myVotes[voteId];
      return Boolean(voteInfo && voteInfo.deleteId === deleteId);
    },
    () => false,
  );

  if (!canDelete) {
    return null;
  }

  return (
    <div className="contents">
      <VoteDeleteButton id={voteId} deleteId={deleteId} />
    </div>
  );
}

