import { z } from "zod";

const voteItemSchema = z.object({
  annict_id: z.number().int().positive().max(2147483647),
  coin_value: z.number().int().min(1).max(100),
});

export const createVoteInputSchema = z.object({
  seasonName: z.string().regex(/^\d{4}-(spring|summer|autumn|winter)$/),
  betAnimes: z.array(voteItemSchema).min(1).max(500).refine(
    (items) => new Set(items.map((item) => item.annict_id)).size === items.length,
    "Duplicate anime IDs",
  ),
});
