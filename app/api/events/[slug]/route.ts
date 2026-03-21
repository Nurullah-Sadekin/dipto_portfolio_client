import { NextRequest, NextResponse } from "next/server";
import type { EventItem } from "@/lib/events";
import { deleteEvent, getEventBySlug, updateEvent } from "@/lib/eventStore";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@123";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

function isAuthorized(request: NextRequest) {
  const password = request.headers.get("x-admin-password");
  return password === ADMIN_PASSWORD;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const body = (await request.json()) as Partial<EventItem>;
    const updated = await updateEvent(slug, body);

    if (!updated) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update event.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const deleted = await deleteEvent(slug);

  if (!deleted) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
