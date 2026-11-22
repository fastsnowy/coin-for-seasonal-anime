"use client";

import { Button } from "@/components/ui/button";
import { loginWithAnnict, linkAnnict } from "@/lib/auth-actions";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function isNextRedirectError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  if (!("digest" in error)) return false;
  return (
    typeof error.digest === "string" && error.digest.includes("NEXT_REDIRECT")
  );
}

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
  const busyLabel = "Annictへ移動中…";

  // Reset the busy state if the page is restored from the back/forward cache
  // after the user returns from Annict without completing the flow.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setLoading(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result =
        mode === "login" ? await loginWithAnnict(nextPath) : await linkAnnict();
      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
      }
      // On success the action redirects to Annict; keep the busy state until
      // the browser navigates away so the button doesn't flash back.
    } catch (error) {
      if (!isNextRedirectError(error)) {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="solid"
        size="lg"
        className="w-full font-semibold"
        onClick={handleClick}
        loading={loading}
        icon={
          <Icon
            icon="simple-icons:annict"
            className="size-[18px]"
            aria-hidden="true"
          />
        }
      >
        {loading ? busyLabel : idleLabel}
      </Button>
      <span className="sr-only" role="status" aria-live="polite">
        {loading ? busyLabel : ""}
      </span>
    </>
  );
}
