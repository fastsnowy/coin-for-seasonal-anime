"use client";

import { Button } from "@/components/ui/button";
import { signInWithDiscord, signInWithGoogle } from "@/lib/auth-actions";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { toast } from "sonner";

type OAuthProvider = "discord" | "google";

const providers = [
  {
    id: "discord" as OAuthProvider,
    label: "Discord",
    linkLabel: "Discordアカウントを連携",
    icon: "simple-icons:discord",
    action: signInWithDiscord,
  },
  {
    id: "google" as OAuthProvider,
    label: "Google",
    linkLabel: "Googleアカウントを連携",
    icon: "simple-icons:google",
    action: signInWithGoogle,
  },
] as const;

export function LoginForm({ isAnonymous }: { isAnonymous: boolean }) {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(
    null,
  );

  const handleOAuth = async (provider: (typeof providers)[number]) => {
    setLoadingProvider(provider.id);
    try {
      const result = await provider.action();
      if (result?.error) {
        toast.error(result.error);
      }
    } catch {
      // redirect throws NEXT_REDIRECT
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant="outline"
          className="w-full h-11 gap-2.5 font-semibold"
          onClick={() => handleOAuth(provider)}
          disabled={loadingProvider !== null}
        >
          {loadingProvider === provider.id ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          ) : (
            <Icon icon={provider.icon} className="h-4.5 w-4.5" />
          )}
          {isAnonymous
            ? provider.linkLabel
            : `${provider.label}でログイン`}
        </Button>
      ))}

      {isAnonymous && (
        <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            現在、匿名ユーザーとしてご利用中です。アカウントを連携すると、別のデバイスからも投票履歴を確認できるようになります。
          </p>
        </div>
      )}
    </div>
  );
}
