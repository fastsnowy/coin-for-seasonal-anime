import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserMenuClient } from "./user-menu-client";

export async function UserMenu() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    (user?.user_metadata?.name as string) ??
    (user?.user_metadata?.username as string) ??
    (user?.user_metadata?.full_name as string) ??
    user?.email ??
    undefined;
  const avatarUrl = (user?.user_metadata?.avatar_url as string) ?? undefined;

  return (
    <UserMenuClient
      isLoggedIn={!!user}
      isAnonymous={user?.is_anonymous ?? true}
      displayName={displayName}
      avatarUrl={avatarUrl}
    />
  );
}
