"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Construction } from "lucide-react";

const providers = [
  {
    id: "discord",
    label: "Discord",
    icon: "simple-icons:discord",
  },
  {
    id: "google",
    label: "Google",
    icon: "simple-icons:google",
  },
] as const;

export function LoginForm() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
        <Construction className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
            開発中
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            アカウント連携機能は現在開発中です。現時点では匿名ユーザーとして投票・履歴の確認が可能です。
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            type="button"
            variant="outline"
            className="w-full h-11 gap-2.5 font-semibold opacity-50 cursor-not-allowed"
            disabled
          >
            <Icon icon={provider.icon} className="h-4.5 w-4.5" />
            {provider.label}で連携（準備中）
          </Button>
        ))}
      </div>
    </div>
  );
}
