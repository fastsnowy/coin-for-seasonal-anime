import { z } from "zod";

const SEASON_PATTERN = /^\d{4}-(spring|summer|autumn|winter)$/;
const MAX_INT4 = 2147483647;

const voteItemSchema = z.object({
  annict_id: z.number().int().positive().max(MAX_INT4),
  coin_value: z.number().int().min(1).max(100),
});

export const createVoteInputSchema = z.object({
  seasonName: z.string().regex(SEASON_PATTERN),
  betAnimes: z
    .array(voteItemSchema)
    .min(1)
    .max(500)
    .refine(
      (items) =>
        new Set(items.map((item) => item.annict_id)).size === items.length,
      "Duplicate anime IDs",
    ),
});

/** 投票グループID（created_id）は crypto.randomUUID() で生成したUUID */
export const voteGroupIdSchema = z.uuid();
