import { promises as fs } from "node:fs";
import path from "node:path";
import { events as seedEvents, type EventItem } from "@/lib/events";

const DATA_DIR = process.env.VERCEL
  ? "/tmp/portfolio-data"
  : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "events.json");

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(seedEvents, null, 2), "utf-8");
  }
}

async function writeEvents(events: EventItem[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), "utf-8");
}

export async function getAllEvents(): Promise<EventItem[]> {
  await ensureDataFile();

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as EventItem[];
    return Array.isArray(parsed) ? parsed : seedEvents;
  } catch {
    return seedEvents;
  }
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const events = await getAllEvents();
  return events.find((event) => event.slug === slug) ?? null;
}

export async function createEvent(input: EventItem): Promise<EventItem> {
  const events = await getAllEvents();
  const slug = slugify(input.slug || input.name);

  if (events.some((event) => event.slug === slug)) {
    throw new Error("An event with this slug already exists.");
  }

  const payload: EventItem = { ...input, slug };
  events.push(payload);
  await writeEvents(events);
  return payload;
}

export async function updateEvent(
  slug: string,
  updates: Partial<EventItem>,
): Promise<EventItem | null> {
  const events = await getAllEvents();
  const index = events.findIndex((event) => event.slug === slug);

  if (index === -1) {
    return null;
  }

  const nextSlug = updates.slug ? slugify(updates.slug) : events[index].slug;
  if (
    nextSlug !== slug &&
    events.some((event, i) => i !== index && event.slug === nextSlug)
  ) {
    throw new Error("Another event already uses that slug.");
  }

  const updated: EventItem = {
    ...events[index],
    ...updates,
    slug: nextSlug,
  };

  events[index] = updated;
  await writeEvents(events);
  return updated;
}

export async function deleteEvent(slug: string): Promise<boolean> {
  const events = await getAllEvents();
  const filtered = events.filter((event) => event.slug !== slug);

  if (filtered.length === events.length) {
    return false;
  }

  await writeEvents(filtered);
  return true;
}
