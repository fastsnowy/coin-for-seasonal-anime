"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

/** URL の `logged_in=1` / `linked=1` を検知してトースト表示し、クエリを取り除く */
export function AuthSuccessToast() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const linked = searchParams.get("linked") === "1";
    const loggedIn = searchParams.get("logged_in") === "1";
    if (!linked && !loggedIn) return;

    toast.success(
      linked ? "Annictアカウントを連携しました" : "ログインしました",
      { id: "auth-success-toast" },
    );

    const params = new URLSearchParams(searchParams.toString());
    params.delete("logged_in");
    params.delete("linked");
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);
  }, [pathname, router, searchParams]);

  return null;
}
