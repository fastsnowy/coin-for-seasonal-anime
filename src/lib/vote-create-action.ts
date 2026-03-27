"use server";

import { DB_TABLES } from "@/config/database";
import type { TablesInsert } from "@/lib/schema";
import { z } from "zod";
import { createSupabaseServerClient } from "./supabaseClient";

const voteItemSchema = z.object({
  annict_id: z.number().int().positive(),
  coin_value: z.number().int().min(1).max(100),
});

const createVoteInputSchema = z.object({
  seasonName: z.string().regex(/^\d{4}-(spring|summer|autumn|winter)$/),
  betAnimes: z.array(voteItemSchema).min(1),
});

const deleteIdCharacters = "0123456789abcdefghijklmnopqrstuvwxyz";
const deleteIdLength = 7;

function generateDeleteId() {
  const randomValues = crypto.getRandomValues(new Uint8Array(deleteIdLength));
  return Array.from(randomValues, (value) => {
    return deleteIdCharacters[value % deleteIdCharacters.length];
  }).join("");
}

export async function createVoteAction(input: unknown) {
  const parsedInput = createVoteInputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new Error("Failed to create vote data");
  }

  const resultId = crypto.randomUUID();
  const deleteId = generateDeleteId();
  const { seasonName, betAnimes } = parsedInput.data;

  const insertData: TablesInsert<typeof DB_TABLES.COINS>[] = betAnimes.map(
    (item) => ({
      annict_id: item.annict_id,
      coin_value: item.coin_value,
      season: seasonName,
      created_id: resultId,
      delete_id: deleteId,
    }),
  );

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from(DB_TABLES.COINS).insert(insertData);

  if (error) {
    throw new Error("Failed to insert vote data");
  }

  return { resultId, deleteId };
}
