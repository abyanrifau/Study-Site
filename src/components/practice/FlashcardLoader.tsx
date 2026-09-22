"use client";

import { FlashcardDeck } from "./FlashcardDeck";
import { useJson } from "@/lib/useJson";
import type { Flashcard } from "@/lib/content";

export function FlashcardLoader() {
  const { data, loading } = useJson<Flashcard[]>("/data/flashcards.json");

  if (loading) {
    return <p className="py-10 text-center text-[15px] text-faint">Loading cards…</p>;
  }

  return <FlashcardDeck cards={data ?? []} />;
}
