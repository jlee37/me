import { NextResponse } from "next/server";
import db from "../../../../../lib/db";
import { menagerieEntries, menagerieBlocks } from "../../../../../lib/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
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
  } catch (err) {
    console.error(`GET /api/menagerie/${slug} error:`, err);
    return NextResponse.json(
      { error: "Failed to fetch menagerie entry" },
      { status: 500 }
    );
  }
}
