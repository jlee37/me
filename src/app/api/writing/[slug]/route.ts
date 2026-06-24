import { NextResponse } from "next/server";
import db from "../../../../../lib/db";
import { writingEntries } from "../../../../../lib/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const [entry] = await db
      .select()
      .from(writingEntries)
      .where(eq(writingEntries.slug, slug));

    if (!entry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (err) {
    console.error(`GET /api/writing/${slug} error:`, err);
    return NextResponse.json(
      { error: "Failed to fetch writing entry" },
      { status: 500 }
    );
  }
}
