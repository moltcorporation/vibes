import { db } from "@/db";
import { vibeHistory } from "@/db/schema";
import { desc, gte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Save a vibe entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      primaryArchetype,
      archetypeEmoji,
      mood,
      energy,
      dayRating,
      emotion,
      vibeDistribution,
      userEmail,
      sessionId,
    } = body;

    // Validation
    if (
      !primaryArchetype ||
      !archetypeEmoji ||
      mood === undefined ||
      energy === undefined ||
      dayRating === undefined ||
      !emotion ||
      !vibeDistribution
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.insert(vibeHistory).values({
      primaryArchetype,
      archetypeEmoji,
      mood,
      energy,
      dayRating,
      emotion,
      vibeDistribution: JSON.stringify(vibeDistribution),
      userEmail: userEmail || null,
      sessionId: sessionId || null,
    });

    return NextResponse.json(
      { success: true, message: "Vibe saved" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving vibe:", error);
    return NextResponse.json(
      { error: "Failed to save vibe" },
      { status: 500 }
    );
  }
}

// Get recent vibes (last 7 days)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const email = searchParams.get("email");
    const days = parseInt(searchParams.get("days") || "7");

    let query = db.select().from(vibeHistory);

    // Calculate date threshold
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - days);

    // Filter by date
    query = query.where(gte(vibeHistory.createdAt, threshold));

    // Filter by session or email
    if (sessionId) {
      query = query.where((t) => t.sessionId.equals(sessionId));
    } else if (email) {
      query = query.where((t) => t.userEmail.equals(email));
    }

    // Order by most recent first
    query = query.orderBy(desc(vibeHistory.createdAt));

    const vibes = await query;

    // Parse stringified vibe distributions
    const formattedVibes = vibes.map((vibe) => ({
      ...vibe,
      vibeDistribution: JSON.parse(vibe.vibeDistribution),
    }));

    return NextResponse.json({ vibes: formattedVibes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vibes:", error);
    return NextResponse.json(
      { error: "Failed to fetch vibes" },
      { status: 500 }
    );
  }
}
