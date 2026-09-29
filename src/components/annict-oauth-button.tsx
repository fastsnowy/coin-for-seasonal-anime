"use client";

import { Button } from "@/components/ui/button";
import { loginWithAnnict, linkAnnict } from "@/lib/auth-actions";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { toast } from "sonner";

export function AnnictOAuthButton({
  mode,
  nextPath,
}: {
  mode: "login" | "link";
  nextPath?: string;
}) {
  const [loading, setLoading] = useState(false);
  const idleLabel =
    mode === "login" ? "Annictでログイン" : "Annictアカウントを連携";
  const busyLabel = mode === "login" ? "ログイン中…" : "連携中…";

  const handleClick = async () => {
    setLoading(true);
    try {
      const result =
        mode === "login"
          ? await loginWithAnnict(nextPath)
          : await linkAnnict();
      if (result?.error) {
        toast.error(result.error);
      }
    } catch {
      // redirect throws NEXT_REDIRECT
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full gap-2.5 font-semibold"
      onClick={handleClick}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? (
        <div
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      ) : (
        <Icon icon="simple-icons:annict" className="h-4.5 w-4.5" />
      )}
      {loading ? busyLabel : idleLabel}
    </Button>
  );
}
