import { NextRequest, NextResponse } from "next/server";
import { eq, asc } from "drizzle-orm";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import db from "../../../../../lib/db";
import { photojournalEntries, photojournalBlocks } from "../../../../../lib/schema";
import { SessionData, sessionOptions } from "../../../../../lib/session";
import { EditorBlock } from "../../../../../types/journal";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { slug } = await ctx.params;

  const [entry] = await db
    .select()
    .from(photojournalEntries)
    .where(eq(photojournalEntries.slug, slug));

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const blocks = await db
    .select()
    .from(photojournalBlocks)
    .where(eq(photojournalBlocks.entryId, entry.id))
    .orderBy(asc(photojournalBlocks.position));

  return NextResponse.json({ ...entry, blocks });
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  const { slug } = await ctx.params;

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [existing] = await db
    .select()
    .from(photojournalEntries)
    .where(eq(photojournalEntries.slug, slug));

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const {
    title,
    date,
    opener,
    locationLat,
    locationLon,
    previewPhotoUrl,
    blocks,
  }: {
    title?: string;
    date?: string;
    opener?: string | null;
    locationLat?: number | null;
    locationLon?: number | null;
    previewPhotoUrl?: string | null;
    blocks?: EditorBlock[];
  } = body;

  const [updated] = await db
    .update(photojournalEntries)
    .set({
      ...(title !== undefined && { title }),
      ...(date !== undefined && { date }),
      ...(opener !== undefined && { opener }),
      ...(locationLat !== undefined && { locationLat }),
      ...(locationLon !== undefined && { locationLon }),
      ...(previewPhotoUrl !== undefined && { previewPhotoUrl }),
      updatedAt: new Date(),
    })
    .where(eq(photojournalEntries.id, existing.id))
    .returning();

  if (blocks !== undefined) {
    await db
      .delete(photojournalBlocks)
      .where(eq(photojournalBlocks.entryId, existing.id));

    if (blocks.length) {
      await db.insert(photojournalBlocks).values(
        blocks.map((b, i) => ({
          entryId: existing.id,
          position: i,
          type: b.type,
          content: b.content,
        }))
      );
    }
  }

  const freshBlocks = await db
    .select()
    .from(photojournalBlocks)
    .where(eq(photojournalBlocks.entryId, existing.id))
    .orderBy(asc(photojournalBlocks.position));

  return NextResponse.json({ ...updated, blocks: freshBlocks });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const { slug } = await ctx.params;

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [existing] = await db
    .select()
    .from(photojournalEntries)
    .where(eq(photojournalEntries.slug, slug));

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db
    .delete(photojournalEntries)
    .where(eq(photojournalEntries.id, existing.id));

  return NextResponse.json({ success: true });
}
