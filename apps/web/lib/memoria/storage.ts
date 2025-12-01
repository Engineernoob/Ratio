/**
 * MEMORIA - Storage Layer
 * Handles persistence of memory cards to JSON file
 */

import fs from "fs";
import path from "path";
import type { MemoryCard } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const MEMORIA_FILE = path.join(DATA_DIR, "memoria-cards.json");

/**
 * Load all memory cards from storage
 */
export function loadCards(): MemoryCard[] {
  try {
    if (fs.existsSync(MEMORIA_FILE)) {
      const data = fs.readFileSync(MEMORIA_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return parsed.cards || [];
    }
  } catch (error) {
    console.error("Error loading memory cards:", error);
  }
  return [];
}

/**
 * Save all memory cards to storage
 */
export function saveCards(cards: MemoryCard[]): void {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    fs.writeFileSync(MEMORIA_FILE, JSON.stringify({ cards }, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving memory cards:", error);
    throw error;
  }
}

/**
 * Get a single card by ID
 */
export function getCardById(id: string): MemoryCard | null {
  const cards = loadCards();
  return cards.find((card) => card.id === id) || null;
}

/**
 * Create a new card
 */
export function createCard(card: MemoryCard): MemoryCard {
  const cards = loadCards();

  // Check if card already exists
  if (cards.find((c) => c.id === card.id)) {
    throw new Error(`Card with id ${card.id} already exists`);
  }

  cards.push(card);
  saveCards(cards);
  return card;
}

/**
 * Update an existing card
 */
export function updateCard(updatedCard: MemoryCard): MemoryCard {
  const cards = loadCards();
  const index = cards.findIndex((c) => c.id === updatedCard.id);

  if (index === -1) {
    throw new Error(`Card with id ${updatedCard.id} not found`);
  }

  cards[index] = updatedCard;
  saveCards(cards);
  return updatedCard;
}

/**
 * Delete a card
 */
export function deleteCard(id: string): boolean {
  const cards = loadCards();
  const filtered = cards.filter((c) => c.id !== id);

  if (filtered.length === cards.length) {
    return false; // Card not found
  }

  saveCards(filtered);
  return true;
}

/**
 * Get all cards
 */
export function getAllCards(): MemoryCard[] {
  return loadCards();
}
