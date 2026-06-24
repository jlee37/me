import { NextResponse } from "next/server";
import db from "../../../../lib/db";
import { writingEntries } from "../../../../lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(writingEntries)
      .orderBy(desc(writingEntries.date));
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/writing error:", err);
    return NextResponse.json(
      { error: "Failed to fetch writing entries" },
      { status: 500 }
    );
  }
}
