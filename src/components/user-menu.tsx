import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserMenuClient } from "./user-menu-client";

export async function UserMenu() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <UserMenuClient
      isLoggedIn={!!user}
      isAnonymous={user?.is_anonymous ?? true}
      email={user?.email ?? undefined}
    />
  );
}
