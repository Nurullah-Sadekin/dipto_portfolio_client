import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { getAllEvents } from "@/lib/eventStore";
import { getSiteContent } from "@/lib/siteContentStore";

export default async function EventsPage() {
  const siteContent = await getSiteContent();
  const events = await getAllEvents();

  return (
    <main className="site-container section-gap">
      <div className="section-header">
        <p className="eyebrow">{siteContent.eventsPage.eyebrow}</p>
        <h1>{siteContent.eventsPage.title}</h1>
        <p>{siteContent.eventsPage.description}</p>
      </div>

      <div className="event-grid">
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>

      <div className="section-cta">
        <Link className="btn btn-outline" href="/">
          {siteContent.eventsPage.backButtonLabel}
        </Link>
      </div>
    </main>
  );
}
