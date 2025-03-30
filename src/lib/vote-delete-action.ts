"use server";
import { redirect } from "next/navigation";
import { supabase } from "./supabaseClient";

export const handleDeleteVote = async (id: string) => {
  const { error } = await supabase
    .from("dev_coins")
    .update({
      deleted_at: new Date().toISOString(), // UTCタイムゾーンでの論理削除
    })
    .eq("created_id", id); // 条件: created_idが一致するレコード

  if (error) {
    console.error("Failed to delete vote:", error); // エラーをログに出力
    return; // エラーが発生した場合は処理を中断
  }

  console.log("Vote deleted successfully");
  redirect("/"); // 削除成功後にトップページへリダイレクト
};
