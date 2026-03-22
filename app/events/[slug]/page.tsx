import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEvents, getEventBySlug } from "@/lib/eventStore";
import { getSiteContent } from "@/lib/siteContentStore";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const siteContent = await getSiteContent();
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="site-container section-gap">
      <div className="section-header">
        <p className="eyebrow">{siteContent.eventDetail.eyebrow}</p>
        <h1>{event.name}</h1>
        <p>{event.shortDescription}</p>
      </div>

      <Image
        src={event.coverImage}
        alt={event.name}
        className="detail-cover"
        width={1200}
        height={760}
        priority
      />

      <section className="detail-meta-grid">
        <article>
          <h3>{siteContent.eventDetail.locationLabel}</h3>
          <p>{event.location}</p>
        </article>
        <article>
          <h3>{siteContent.eventDetail.clientLabel}</h3>
          <p>{event.client}</p>
        </article>
        <article>
          <h3>{siteContent.eventDetail.attendeesLabel}</h3>
          <p>{event.attendees}</p>
        </article>
      </section>

      <section className="detail-block">
        <h2>{siteContent.eventDetail.experienceTitle}</h2>
        <p>{event.experience}</p>
      </section>

      <section className="detail-block">
        <h2>{siteContent.eventDetail.galleryTitle}</h2>
        <div className="gallery-grid">
          {event.gallery.map((image) => (
            <Image
              key={image}
              src={image}
              alt={`${event.name} gallery image`}
              width={900}
              height={700}
            />
          ))}
        </div>
      </section>

      <section className="detail-block testimonial">
        <h2>{siteContent.eventDetail.feedbackTitle}</h2>
        <p>&quot;{event.clientFeedback}&quot;</p>
      </section>

      <div className="section-cta">
        <Link className="btn btn-outline" href="/events">
          {siteContent.eventDetail.backButtonLabel}
        </Link>
      </div>
    </main>
  );
}
