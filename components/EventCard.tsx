import Image from "next/image";
import Link from "next/link";
import type { EventItem } from "@/lib/events";

type EventCardProps = {
  event: EventItem;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="event-card">
      <Link href={`/events/${event.slug}`}>
        <Image
          src={event.coverImage}
          alt={event.name}
          className="event-card-image"
          width={900}
          height={600}
        />
        <div className="event-card-body">
          <h3>{event.name}</h3>
          <p>{event.shortDescription}</p>
        </div>
      </Link>
    </article>
  );
}