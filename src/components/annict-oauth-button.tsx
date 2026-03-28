"use client";

import { Button } from "@/components/ui/button";
import { loginWithAnnict, linkAnnict } from "@/lib/auth-actions";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { toast } from "sonner";

const config = {
  login: {
    action: loginWithAnnict,
    label: "Annictでログイン",
  },
  link: {
    action: linkAnnict,
    label: "Annictアカウントを連携",
  },
} as const;

export function AnnictOAuthButton({ mode }: { mode: "login" | "link" }) {
  const [loading, setLoading] = useState(false);
  const { action, label } = config[mode];

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await action();
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
      className="w-full h-11 gap-2.5 font-semibold"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : (
        <Icon icon="simple-icons:annict" className="h-4.5 w-4.5" />
      )}
      {label}
    </Button>
  );
}
