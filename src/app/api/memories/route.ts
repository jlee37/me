import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import db from "../../../../lib/db";
import { photojournalEntries, photojournalBlocks } from "../../../../lib/schema";
import { SessionData, sessionOptions } from "../../../../lib/session";
import { EditorBlock } from "../../../../types/journal";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(photojournalEntries)
      .orderBy(photojournalEntries.date);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/memories error:", err);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
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
  const {
    title,
    slug,
    date,
    opener,
    locationLat,
    locationLon,
    requireKeyForText,
    previewPhotoUrl,
    blocks,
  }: {
    title: string;
    slug: string;
    date: string;
    opener?: string;
    locationLat?: number | null;
    locationLon?: number | null;
    requireKeyForText?: boolean;
    previewPhotoUrl?: string;
    blocks: EditorBlock[];
  } = body;

  if (!title || !slug || !date) {
    return NextResponse.json(
      { error: "title, slug, and date are required" },
      { status: 400 }
    );
  }

  const [entry] = await db
    .insert(photojournalEntries)
    .values({
      title,
      slug,
      date,
      opener: opener ?? null,
      locationLat: locationLat ?? null,
      locationLon: locationLon ?? null,
      requireKeyForText: requireKeyForText ?? false,
      previewPhotoUrl: previewPhotoUrl ?? null,
    })
    .returning();

  if (blocks?.length) {
    await db.insert(photojournalBlocks).values(
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
