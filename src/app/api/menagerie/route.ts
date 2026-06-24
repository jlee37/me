import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import db from "../../../../lib/db";
import { menagerieEntries, menagerieBlocks } from "../../../../lib/schema";
import { SessionData, sessionOptions } from "../../../../lib/session";
import { desc } from "drizzle-orm";
import { EditorBlock } from "../../../../types/journal";

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

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, date, opener, locationLat, locationLon, previewPhotoUrl, blocks } = body as {
    title: string;
    slug: string;
    date: string;
    opener?: string;
    locationLat?: number | null;
    locationLon?: number | null;
    previewPhotoUrl?: string;
    blocks: EditorBlock[];
  };

  if (!title || !slug || !date) {
    return NextResponse.json(
      { error: "title, slug, and date are required" },
      { status: 400 }
    );
  }

  const [entry] = await db
    .insert(menagerieEntries)
    .values({
      title,
      slug,
      date,
      opener: opener ?? null,
      locationLat: locationLat ?? null,
      locationLon: locationLon ?? null,
      previewPhotoUrl: previewPhotoUrl ?? null,
    })
    .returning();

  if (blocks?.length) {
    await db.insert(menagerieBlocks).values(
      blocks.map((b, i) => ({
        entryId: entry.id,
        position: i,
        type: b.type,
        content: b.content,
      }))
    );
  }

  return NextResponse.json(entry, { status: 201 });
}
