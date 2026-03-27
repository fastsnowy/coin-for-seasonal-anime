import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserMenuClient } from "./user-menu-client";

export async function UserMenu() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    (user?.user_metadata?.name as string) ??
    (user?.user_metadata?.user_name as string) ??
    user?.email ??
    undefined;

  return (
    <UserMenuClient
      isLoggedIn={!!user}
      isAnonymous={user?.is_anonymous ?? true}
      displayName={displayName}
    />
  );
}
