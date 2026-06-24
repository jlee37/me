import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "../../../../../lib/session";
import { hashPassword } from "../../../../../lib/hashPassword";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  session.isAdmin = true;
  await session.save();

  const deviceToken = hashPassword(password);
  return NextResponse.json({ success: true, deviceToken });
}

export async function DELETE() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  session.destroy();

  return NextResponse.json({ success: true });
}
