import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "../../../../../lib/session";
import { hashPassword } from "../../../../../lib/hashPassword";

export async function POST(req: NextRequest) {
  const { deviceToken } = await req.json();

  if (!deviceToken || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const currentToken = hashPassword(process.env.ADMIN_PASSWORD);

  if (deviceToken !== currentToken) {
    return NextResponse.json({ error: "Token expired" }, { status: 401 });
  }

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  session.isAdmin = true;
  await session.save();

  return NextResponse.json({ success: true });
}
