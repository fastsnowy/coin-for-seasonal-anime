"use server";
import { DB_TABLES } from "@/config/database";
import { createSupabaseServerClient } from "./supabaseClient";

export const handleDeleteVote = async (id: string, deleteId: string) => {
  const supabase = createSupabaseServerClient();

  // すでに削除済みかどうか、または存在するかを確認する
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
    return true; // すでに削除済みの場合は成功とみなす
  }

  const { error } = await supabase
    .from(DB_TABLES.COINS)
    .update({
      deleted_at: new Date().toISOString(), // UTCタイムゾーンでの論理削除
    })
    .eq("created_id", id)
    .eq("delete_id", deleteId); // 条件: created_id と delete_id が一致するレコード

  if (error) {
    console.error("Failed to delete vote:", error); // エラーをログに出力
    return false; // エラーが発生した場合は失敗
  }

  console.log("Vote deleted successfully");
  return true; // 成功
};
