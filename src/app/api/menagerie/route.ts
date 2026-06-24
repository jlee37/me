import { NextResponse } from "next/server";
import db from "../../../../lib/db";
import { menagerieEntries } from "../../../../lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(menagerieEntries)
      .orderBy(desc(menagerieEntries.date));
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/menagerie error:", err);
    return NextResponse.json(
      { error: "Failed to fetch menagerie entries" },
      { status: 500 }
    );
  }
}
