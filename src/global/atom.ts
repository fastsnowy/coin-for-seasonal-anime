import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

export const atomFamilyBetCoin = atomFamily((id: number) => atom(0));

export const atomFamilyTotalCoin = atomFamily((id: number) => atom(0));
