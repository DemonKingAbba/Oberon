import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { parseText } from "@/app/lib/parsing";
import authOptions from "@/app/lib/serverAuthOptions";

export async function GET() {
  const session = await getServerSession(authOptions as any);
  const accessToken = (session as any)?.accessToken as string | undefined;
  if (!accessToken) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const list = await gmail.users.messages.list({ userId: "me", q: "newer_than:7d", maxResults: 15 });

  const messages = list.data.messages || [];
  const out: any[] = [];

  for (const m of messages) {
    if (!m.id) continue;
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: m.id,
      format: "metadata",
      metadataHeaders: ["Subject", "From"]
    });

    const headers = msg.data.payload?.headers || [];
    const subject = headers.find(h => h.name === "Subject")?.value || "Email";
    const from = headers.find(h => h.name === "From")?.value || "Unknown";
    const snippet = msg.data.snippet || "";

    const parsed = parseText(subject, snippet);
    out.push({ id: m.id, source:"GMAIL", from, subject, ...parsed });
  }

  const weight = (t: string) => t === "URGENT" ? 0 : t === "FIX_REQUIRED" ? 1 : 2;
  out.sort((a,b) => weight(a.type) - weight(b.type));

  return NextResponse.json({ items: out });
}
