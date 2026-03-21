import { NextRequest, NextResponse } from "next/server";
import type { EventItem } from "@/lib/events";
import { createEvent, getAllEvents } from "@/lib/eventStore";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@123";

function isAuthorized(request: NextRequest) {
  const password = request.headers.get("x-admin-password");
  return password === ADMIN_PASSWORD;
}

function hasRequiredFields(input: Partial<EventItem>) {
  return (
    !!input.slug &&
    !!input.name &&
    !!input.shortDescription &&
    !!input.location &&
    !!input.client &&
    !!input.attendees &&
    !!input.experience &&
    !!input.clientFeedback &&
    !!input.coverImage &&
    Array.isArray(input.gallery)
  );
}

export async function GET() {
  try {
    const events = await getAllEvents();
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: "Failed to load events." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<EventItem>;
    if (!hasRequiredFields(body)) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const created = await createEvent(body as EventItem);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create event.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
