import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import db from "../../../../lib/db";
import { writingEntries } from "../../../../lib/schema";
import { SessionData, sessionOptions } from "../../../../lib/session";
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

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, date, heroUrl, content } = body as {
    title: string;
    slug: string;
    date: string;
    heroUrl?: string;
    content: string;
  };

  if (!title || !slug || !date || !content) {
    return NextResponse.json(
      { error: "title, slug, date, and content are required" },
      { status: 400 }
    );
  }

  const [entry] = await db
    .insert(writingEntries)
    .values({ title, slug, date, heroUrl: heroUrl ?? null, content })
    .returning();

  return NextResponse.json(entry, { status: 201 });
}
