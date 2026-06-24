import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import db from "../../../../../lib/db";
import { menagerieEntries, menagerieBlocks } from "../../../../../lib/schema";
import { SessionData, sessionOptions } from "../../../../../lib/session";
import { eq, asc } from "drizzle-orm";
import { EditorBlock } from "../../../../../types/journal";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { slug } = await ctx.params;

  const [entry] = await db
    .select()
    .from(menagerieEntries)
    .where(eq(menagerieEntries.slug, slug));

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const blocks = await db
    .select()
    .from(menagerieBlocks)
    .where(eq(menagerieBlocks.entryId, entry.id))
    .orderBy(asc(menagerieBlocks.position));

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
    .from(menagerieEntries)
    .where(eq(menagerieEntries.slug, slug));

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { title, date, opener, locationLat, locationLon, previewPhotoUrl, blocks } = body as {
    title?: string;
    date?: string;
    opener?: string | null;
    locationLat?: number | null;
    locationLon?: number | null;
    previewPhotoUrl?: string | null;
    blocks?: EditorBlock[];
  };

  const [updated] = await db
    .update(menagerieEntries)
    .set({
      ...(title !== undefined && { title }),
      ...(date !== undefined && { date }),
      ...(opener !== undefined && { opener }),
      ...(locationLat !== undefined && { locationLat }),
      ...(locationLon !== undefined && { locationLon }),
      ...(previewPhotoUrl !== undefined && { previewPhotoUrl }),
      updatedAt: new Date(),
    })
    .where(eq(menagerieEntries.id, existing.id))
    .returning();

  if (blocks !== undefined) {
    await db
      .delete(menagerieBlocks)
      .where(eq(menagerieBlocks.entryId, existing.id));

    if (blocks.length) {
      await db.insert(menagerieBlocks).values(
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
    .from(menagerieBlocks)
    .where(eq(menagerieBlocks.entryId, existing.id))
    .orderBy(asc(menagerieBlocks.position));

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
    .from(menagerieEntries)
    .where(eq(menagerieEntries.slug, slug));

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db
    .delete(menagerieEntries)
    .where(eq(menagerieEntries.id, existing.id));

  return NextResponse.json({ success: true });
}
