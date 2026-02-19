// Vibe calculation and archetype matching

export interface VibeResults {
  primaryArchetype: string;
  archetypeEmoji: string;
  archetypeDescription: string;
  vibeDistribution: {
    archetype: string;
    emoji: string;
    percentage: number;
    label: string;
  }[];
  overallMood: number;
  overallEnergy: number;
  overallDay: number;
}

export const ARCHETYPES = {
  chaotic: {
    name: 'Chaotic Energy',
    emoji: '⚡',
    description:
      "You're a force of nature today! Unpredictable, bold, and ready to shake things up. Your vibe is contagious and everyone around you can feel it.",
    traits: ['spontaneous', 'bold', 'unpredictable', 'energetic'],
  },
  zen: {
    name: 'Zen Mode',
    emoji: '🧘',
    description:
      "Inner peace is your superpower right now. Calm, grounded, and present. You're operating at a level of clarity that makes everything seem simple.",
    traits: ['calm', 'grounded', 'peaceful', 'mindful'],
  },
  grinding: {
    name: 'Grinding',
    emoji: '💪',
    description:
      "You're in beast mode. Focused, determined, and unstoppable. Nothing can derail your momentum today. This is your power hour.",
    traits: ['determined', 'focused', 'powerful', 'productive'],
  },
  cozy: {
    name: 'Cozy',
    emoji: '🏠',
    description:
      "Comfort is your priority. You want the warm lights, the soft vibes, and the good company (or quality solo time). Relaxation mode activated.",
    traits: ['comfortable', 'warm', 'relaxed', 'nurturing'],
  },
  vibing: {
    name: 'Vibing',
    emoji: '✨',
    description:
      "You're in the zone. Everything feels right. You're radiating good energy and good things are coming your way. This is peak vibes.",
    traits: ['optimistic', 'magnetic', 'aligned', 'flowing'],
  },
  galaxy: {
    name: 'Galaxy Brain',
    emoji: '🧠',
    description:
      "You're operating on a different level today. Your thoughts are infinite, your ideas are revolutionary. You can see ten steps ahead.",
    traits: ['intelligent', 'visionary', 'inspired', 'transcendent'],
  },
};

export function calculateVibes(
  mood: number,
  energy: number,
  dayRating: number,
  selectedArchetype: string,
  emotion: string
): VibeResults {
  // Normalize scores
  const normalizedMood = mood / 10;
  const normalizedEnergy = energy / 10;
  const normalizedDay = dayRating / 10;

  // Calculate vibe distribution based on inputs
  const baseDistribution: Record<string, number> = {
    chaotic: Math.abs(energy - 5) / 5, // High energy = chaotic
    zen: 1 - normalizedMood / 2 + (10 - energy) / 10, // Low mood/energy = zen
    grinding: normalizedMood * 0.6 + normalizedDay * 0.4, // Good mood + good day = grinding
    cozy: 1 - normalizedEnergy / 2, // Low energy = cozy
    vibing: normalizedMood * 0.7 + normalizedDay * 0.3, // Good overall = vibing
    galaxy: normalizedMood * 0.5 + normalizedEnergy * 0.3 + (normalizedDay - 0.5) * 0.2, // Balanced high stats = galaxy
  };

  // Boost selected archetype
  baseDistribution[selectedArchetype] *= 1.5;

  // Normalize to percentages
  const total = Object.values(baseDistribution).reduce((a, b) => a + b, 0);
  const vibeDistribution = Object.entries(baseDistribution)
    .map(([arch, score]) => ({
      archetype: arch,
      emoji: ARCHETYPES[arch as keyof typeof ARCHETYPES].emoji,
      percentage: Math.round((score / total) * 100),
      label: ARCHETYPES[arch as keyof typeof ARCHETYPES].name,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const primaryArchetype = vibeDistribution[0].archetype;
  const archetypeInfo = ARCHETYPES[primaryArchetype as keyof typeof ARCHETYPES];

  return {
    primaryArchetype,
    archetypeEmoji: archetypeInfo.emoji,
    archetypeDescription: archetypeInfo.description,
    vibeDistribution,
    overallMood: mood,
    overallEnergy: energy,
    overallDay: dayRating,
  };
}
