export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

import client from "@/lib/session.server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const name = searchParams.get("name");
  if (!name) return new Response(null, { status: 400 });
  if (!client) return new Response(null, { status: 500 });
  const userToken = client.createUserToken(name);
  return NextResponse.json({ userToken });
}
