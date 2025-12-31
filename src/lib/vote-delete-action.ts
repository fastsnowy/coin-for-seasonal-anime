"use server";
import { supabase } from "./supabaseClient";

export const handleDeleteVote = async (id: string) => {
  // すでに削除済みかどうか、または存在するかを確認する
  const { data: existingVote, error: fetchError } = await supabase
    .from("dev_coins")
    .select("deleted_at")
    .eq("created_id", id)
    .single();

  if (fetchError) {
    console.error("Failed to fetch vote for deletion:", fetchError);
    return;
  }

  if (existingVote?.deleted_at) {
    console.log("Vote already deleted");
    return true; // すでに削除済みの場合は成功とみなす
  }

  const { error } = await supabase
    .from("dev_coins")
    .update({
      deleted_at: new Date().toISOString(), // UTCタイムゾーンでの論理削除
    })
    .eq("created_id", id); // 条件: created_idが一致するレコード

  if (error) {
    console.error("Failed to delete vote:", error); // エラーをログに出力
    return false; // エラーが発生した場合は失敗
  }

  console.log("Vote deleted successfully");
  return true; // 成功
};
