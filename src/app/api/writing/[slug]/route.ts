import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import db from "../../../../../lib/db";
import { writingEntries } from "../../../../../lib/schema";
import { SessionData, sessionOptions } from "../../../../../lib/session";
import { eq } from "drizzle-orm";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { slug } = await ctx.params;
  const [entry] = await db
    .select()
    .from(writingEntries)
    .where(eq(writingEntries.slug, slug));

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(entry);
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
    .from(writingEntries)
    .where(eq(writingEntries.slug, slug));

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { title, date, heroUrl, content } = body as {
    title?: string;
    date?: string;
    heroUrl?: string | null;
    content?: string;
  };

  const [updated] = await db
    .update(writingEntries)
    .set({
      ...(title !== undefined && { title }),
      ...(date !== undefined && { date }),
      ...(heroUrl !== undefined && { heroUrl }),
      ...(content !== undefined && { content }),
      updatedAt: new Date(),
    })
    .where(eq(writingEntries.id, existing.id))
    .returning();

  return NextResponse.json(updated);
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
    .from(writingEntries)
    .where(eq(writingEntries.slug, slug));

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(writingEntries).where(eq(writingEntries.id, existing.id));

  return NextResponse.json({ success: true });
}
