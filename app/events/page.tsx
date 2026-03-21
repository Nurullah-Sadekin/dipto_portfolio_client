import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { getAllEvents } from "@/lib/eventStore";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <main className="site-container section-gap">
      <div className="section-header">
        <p className="eyebrow">All Events</p>
        <h1>Portfolio of Activation Projects</h1>
        <p>
          A growing portfolio of experiential campaigns, launch events, and
          high-engagement brand activations.
        </p>
      </div>

      <div className="event-grid">
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>

      <div className="section-cta">
        <Link className="btn btn-outline" href="/">
          Back to Home
        </Link>
      </div>
    </main>
  );
}