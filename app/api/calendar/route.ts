export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import authOptions from "../../lib/serverAuthOptions";

export async function GET() {
  const session = await getServerSession(authOptions as any);
  const accessToken = (session as any)?.accessToken as string | undefined;
  if (!accessToken) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const now = new Date();
  const week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: now.toISOString(),
    timeMax: week.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 25
  });

  const items = (res.data.items || []).map(ev => ({
    id: ev.id,
    title: ev.summary || "Meeting",
    start: ev.start?.dateTime || ev.start?.date,
    end: ev.end?.dateTime || ev.end?.date,
    location: ev.location || null
  }));

  return NextResponse.json({ items });
}
