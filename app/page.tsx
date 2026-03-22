import Image from "next/image";
import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { getAllEvents } from "@/lib/eventStore";
import { getSiteContent } from "@/lib/siteContentStore";

export default async function Home() {
  const siteContent = await getSiteContent();
  const events = await getAllEvents();
  const featuredEvents = events.slice(0, siteContent.featuredWork.count);

  return (
    <main>
      <section className="hero-top" id="home">
        <div className="site-container">
          <header className="hero-nav">
            <Link href="/" className="brand-mark">
              {siteContent.brandMark}
            </Link>
            <nav>
              {siteContent.navLinks.map((link) => (
                <a key={`${link.label}-${link.href}`} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </header>

          <div className="hero-main">
            <div className="hero-copy">
              <p className="hello-line">{siteContent.hero.greeting}</p>
              <h1>{siteContent.hero.name}</h1>
              <h2>{siteContent.hero.title}</h2>
              <p className="lead-dark">{siteContent.hero.description}</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href={siteContent.hero.primaryCtaHref}>
                  {siteContent.hero.primaryCtaLabel}
                </a>
                <a
                  className="btn btn-outline-dark"
                  href={siteContent.hero.secondaryCtaHref}
                >
                  {siteContent.hero.secondaryCtaLabel}
                </a>
              </div>
            </div>

            <aside className="profile-card">
              <Image
                src={siteContent.profile.image}
                alt={siteContent.profile.imageAlt}
                width={240}
                height={240}
                className="profile-avatar"
                priority
              />
              <h3>{siteContent.profile.title}</h3>
              <p>{siteContent.profile.subtitle}</p>
              <small>{siteContent.profile.location}</small>
            </aside>
          </div>
          <div className="stat-row dark">
            {siteContent.stats.map((stat) => (
              <article key={`${stat.value}-${stat.label}`}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container section-gap" id="portfolio">
        <div className="section-header">
          <p className="eyebrow">{siteContent.featuredWork.eyebrow}</p>
          <h2>{siteContent.featuredWork.title}</h2>
        </div>
        <div className="event-grid">
          {featuredEvents.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
        <div className="section-cta">
          <Link className="btn btn-dark" href="/events">
            {siteContent.featuredWork.buttonLabel}
          </Link>
        </div>
      </section>

      <section className="site-container section-gap two-col" id="skills">
        <div>
          <p className="eyebrow">{siteContent.skills.eyebrow}</p>
          <h2>{siteContent.skills.title}</h2>
          <p>{siteContent.skills.description}</p>
        </div>
        <ul className="service-list">
          {siteContent.skills.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="site-container section-gap" id="about">
        <div className="section-header">
          <p className="eyebrow">{siteContent.about.eyebrow}</p>
          <h2>{siteContent.about.title}</h2>
          <p>{siteContent.about.description}</p>
        </div>
      </section>

      <section className="site-container section-gap" id="contact">
        <div className="section-header">
          <p className="eyebrow">{siteContent.contact.eyebrow}</p>
          <h2>{siteContent.contact.title}</h2>
          <p>{siteContent.contact.description}</p>
        </div>
        <div className="social-grid">
          {siteContent.contact.links.map((link) => (
            <a
              key={`${link.label}-${link.href}`}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      <section className="site-container section-gap inquiry" id="inquiry">
        <div className="section-header">
          <p className="eyebrow">{siteContent.inquiry.eyebrow}</p>
          <h2>{siteContent.inquiry.title}</h2>
        </div>
        <form className="inquiry-form">
          <label htmlFor="name">{siteContent.inquiry.nameLabel}</label>
          <input
            id="name"
            name="name"
            placeholder={siteContent.inquiry.namePlaceholder}
          />

          <label htmlFor="email">{siteContent.inquiry.emailLabel}</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder={siteContent.inquiry.emailPlaceholder}
          />

          <label htmlFor="company">{siteContent.inquiry.companyLabel}</label>
          <input
            id="company"
            name="company"
            placeholder={siteContent.inquiry.companyPlaceholder}
          />

          <label htmlFor="details">{siteContent.inquiry.detailsLabel}</label>
          <textarea
            id="details"
            name="details"
            rows={5}
            placeholder={siteContent.inquiry.detailsPlaceholder}
          />

          <button type="submit" className="btn btn-primary">
            {siteContent.inquiry.buttonLabel}
          </button>
        </form>
      </section>
    </main>
  );
}
