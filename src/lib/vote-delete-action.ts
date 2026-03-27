"use server";
import { DB_TABLES } from "@/config/database";
import { createSupabaseServerClient } from "./supabaseClient";

export const handleDeleteVote = async (id: string, deleteId: string) => {
  const supabase = await createSupabaseServerClient();

  const { data: existingVotes, error: fetchError } = await supabase
    .from(DB_TABLES.COINS)
    .select("deleted_at")
    .eq("created_id", id)
    .eq("delete_id", deleteId)
    .limit(1);

  if (fetchError || !existingVotes || existingVotes.length === 0) {
    console.error("Failed to fetch vote for deletion:", fetchError);
    return false;
  }

  if (existingVotes[0].deleted_at) {
    console.log("Vote already deleted");
    return true;
  }

  const { error } = await supabase
    .from(DB_TABLES.COINS)
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("created_id", id)
    .eq("delete_id", deleteId);

  if (error) {
    console.error("Failed to delete vote:", error);
    return false;
  }

  console.log("Vote deleted successfully");
  return true;
};
