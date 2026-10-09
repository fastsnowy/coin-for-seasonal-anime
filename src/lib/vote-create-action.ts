"use server";

import { DB_TABLES } from "@/config/database";
import type { TablesInsert } from "@/lib/schema";
import { createSupabaseServerClient } from "./supabaseClient";

import { createVoteInputSchema } from "./vote-input";

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

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required");

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
      user_id: user.id,
    }),
  );

  const { error } = await supabase.from(DB_TABLES.COINS).insert(insertData);

  if (error) {
    throw new Error("Failed to insert vote data");
  }

  return { resultId, deleteId };
}
