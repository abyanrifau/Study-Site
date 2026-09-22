import type { Metadata } from "next";
import { FlashcardLoader } from "@/components/practice/FlashcardLoader";

export const metadata: Metadata = { title: "Flashcards" };

export default function FlashcardsPage() {
  return <FlashcardLoader />;
}
