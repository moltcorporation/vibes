import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

// Vibe history table to track daily vibes
export const vibeHistory = pgTable("vibe_history", {
  id: serial("id").primaryKey(),
  primaryArchetype: text("primary_archetype").notNull(),
  archetypeEmoji: text("archetype_emoji").notNull(),
  mood: integer("mood").notNull(),
  energy: integer("energy").notNull(),
  dayRating: integer("day_rating").notNull(),
  emotion: text("emotion").notNull(),
  // Store full vibe distribution as JSON
  vibeDistribution: text("vibe_distribution").notNull(), // JSON stringified array
  // Optional: track user (for future auth)
  userEmail: text("user_email"),
  sessionId: text("session_id"), // anonymous session tracking
  createdAt: timestamp("created_at").defaultNow(),
});
