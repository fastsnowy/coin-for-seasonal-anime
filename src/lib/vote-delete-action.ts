"use server";
import { DB_TABLES } from "@/config/database";
import { createSupabaseServerClient } from "./supabaseClient";
import { voteGroupIdSchema } from "./vote-input";

export const handleDeleteVote = async (createdId: unknown) => {
  const parsedId = voteGroupIdSchema.safeParse(createdId);
  if (!parsedId.success) {
    return false;
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated");
    return false;
  }

  // RLS で本人の投票だけが対象になるが、念のため user_id でも絞り込む
  const { data: existingVotes, error: fetchError } = await supabase
    .from(DB_TABLES.COINS)
    .select("deleted_at")
    .eq("created_id", parsedId.data)
    .eq("user_id", user.id)
    .limit(1);

  if (fetchError || !existingVotes || existingVotes.length === 0) {
    console.error("Failed to fetch vote for deletion:", fetchError?.code);
    return false;
  }

  if (existingVotes[0].deleted_at) {
    return true;
  }

  const { error } = await supabase
    .from(DB_TABLES.COINS)
    .update({ deleted_at: new Date().toISOString() })
    .eq("created_id", parsedId.data)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete vote:", error.code);
    return false;
  }

  return true;
};
