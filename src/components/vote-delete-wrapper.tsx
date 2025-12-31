"use client";

import { useEffect, useState } from "react";
import { VoteDeleteButton } from "./vote-delete";

interface VoteDeleteWrapperProps {
  voteId: string;
  deleteId: string;
}

export function VoteDeleteWrapper({ voteId, deleteId }: VoteDeleteWrapperProps) {
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    // localStorageをチェックして削除権限を確認
    const myVotes = JSON.parse(localStorage.getItem("myVotes") || "{}");
    const voteInfo = myVotes[voteId];
    if (voteInfo && voteInfo.deleteId === deleteId) {
      setCanDelete(true);
    }
  }, [voteId, deleteId]);

  if (!canDelete) {
    return null;
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <VoteDeleteButton id={voteId} />
    </div>
  );
}

