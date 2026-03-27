"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-actions";
import { History, Link2, LogIn, LogOut, Shield, User } from "lucide-react";
import Link from "next/link";

interface UserMenuClientProps {
  isLoggedIn: boolean;
  isAnonymous: boolean;
  displayName?: string;
}

export function UserMenuClient({
  isLoggedIn,
  isAnonymous,
  displayName,
}: UserMenuClientProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <User className="h-4 w-4" />
          <span className="sr-only">ユーザーメニュー</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isLoggedIn && !isAnonymous ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <p className="text-xs text-muted-foreground truncate">
                {displayName}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        ) : (
          <>
            <DropdownMenuLabel className="font-normal">
              <p className="text-xs text-muted-foreground">ゲストユーザー</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem asChild>
          <Link href="/my-votes" className="cursor-pointer">
            <History className="mr-2 h-4 w-4" />
            投票履歴
          </Link>
        </DropdownMenuItem>

        {isAnonymous || !isLoggedIn ? (
          <>
            <DropdownMenuItem asChild>
              <Link href="/link" className="cursor-pointer">
                <Link2 className="mr-2 h-4 w-4" />
                Annictアカウント連携
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/login" className="cursor-pointer">
                <LogIn className="mr-2 h-4 w-4" />
                ログイン
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={async () => {
              await signOut();
            }}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            ログアウト
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/privacy" className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            プライバシーポリシー
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
