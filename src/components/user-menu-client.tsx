"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";
import { History, Link2, LogIn, LogOut, Shield, User } from "lucide-react";
import Link from "next/link";

interface UserMenuClientProps {
  isLoggedIn: boolean;
  isAnonymous: boolean;
  displayName?: string;
  avatarUrl?: string;
}

function Avatar({
  src,
  name,
  className,
}: {
  src?: string;
  name?: string;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external avatar host, tiny image
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        className={cn(
          "shrink-0 rounded-full object-cover ring-1 ring-border",
          className,
        )}
      />
    );
  }
  const initial = name?.trim().charAt(0).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border",
        className,
      )}
    >
      {initial ? (
        <span className="text-[11px] font-semibold">{initial}</span>
      ) : (
        <User className="size-[55%]" />
      )}
    </span>
  );
}

export function UserMenuClient({
  isLoggedIn,
  isAnonymous,
  displayName,
  avatarUrl,
}: UserMenuClientProps) {
  const isMember = isLoggedIn && !isAnonymous;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={
            isMember && displayName
              ? `ユーザーメニュー（${displayName}）`
              : "ユーザーメニュー"
          }
          className={cn(
            "press flex size-10 items-center justify-center rounded-lg sm:size-9",
            "text-muted-foreground hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground",
            "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35",
          )}
        >
          {isMember ? (
            <Avatar src={avatarUrl} name={displayName} className="size-6" />
          ) : (
            <User className="size-4" aria-hidden="true" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex items-center gap-2.5 py-2 font-normal">
          {isMember ? (
            <>
              <Avatar src={avatarUrl} name={displayName} className="size-8" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {displayName ?? "ユーザー"}
                </p>
                <p className="text-xs text-muted-foreground">Annict連携済み</p>
              </div>
            </>
          ) : (
            <>
              <Avatar className="size-8" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  ゲストユーザー
                </p>
                <p className="text-xs text-muted-foreground">
                  Annict未連携
                </p>
              </div>
            </>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {isMember && (
            <DropdownMenuItem asChild>
              <Link href="/mypage" className="cursor-pointer">
                <User aria-hidden="true" />
                マイページ
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/my-votes" className="cursor-pointer">
              <History aria-hidden="true" />
              投票履歴
            </Link>
          </DropdownMenuItem>
          {!isMember && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/link" className="cursor-pointer">
                  <Link2 aria-hidden="true" />
                  Annictアカウント連携
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login" className="cursor-pointer">
                  <LogIn aria-hidden="true" />
                  ログイン
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/privacy" className="cursor-pointer">
            <Shield aria-hidden="true" />
            プライバシーポリシー
          </Link>
        </DropdownMenuItem>

        {isMember && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                await signOut();
              }}
              className="cursor-pointer"
            >
              <LogOut aria-hidden="true" />
              ログアウト
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
