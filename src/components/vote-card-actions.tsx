"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { VoteDeleteDialog } from "./vote-delete";

export function VoteCardActions({ createdId }: { createdId: string }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-md"
            className="-mr-2 text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
          >
            <MoreHorizontal aria-hidden="true" />
            <span className="sr-only">この投票のメニュー</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2 aria-hidden="true" />
            投票を削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <VoteDeleteDialog
        id={createdId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
