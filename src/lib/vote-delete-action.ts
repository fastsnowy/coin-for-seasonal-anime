"use server";
import { DB_TABLES } from "@/config/database";
import { createSupabaseServerClient } from "./supabaseClient";

export const handleDeleteVote = async (createdId: string) => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated");
    return false;
  }

  const { data: existingVotes, error: fetchError } = await supabase
    .from(DB_TABLES.COINS)
    .select("deleted_at, user_id")
    .eq("created_id", createdId)
    .limit(1);

  if (fetchError || !existingVotes || existingVotes.length === 0) {
    console.error("Failed to fetch vote for deletion:", fetchError);
    return false;
  }

  if (existingVotes[0].user_id !== user.id) {
    console.error("User does not own this vote");
    return false;
  }

  if (existingVotes[0].deleted_at) {
    return true;
  }

  const { error } = await supabase
    .from(DB_TABLES.COINS)
    .update({ deleted_at: new Date().toISOString() })
    .eq("created_id", createdId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete vote:", error);
    return false;
  }

  return true;
};
