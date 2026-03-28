"use client";

import { useState } from "react";
import { toast } from "sonner";
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
  return typeof error.digest === "string" && error.digest.includes("NEXT_REDIRECT");
}

export function DeleteAccountDialog() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive">
          退会する
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">退会しますか？</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed pt-2">
            退会すると現在のアカウントでは投票履歴にアクセスできなくなります。
            <br />
            投票データは匿名として保持されますが、再登録しても過去の投票履歴は引き継がれません。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              キャンセル
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting}
            onClick={async () => {
              if (isSubmitting) return;
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
            {isSubmitting ? "処理中..." : "退会する"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
