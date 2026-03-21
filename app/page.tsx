import Image from "next/image";
import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { getAllEvents } from "@/lib/eventStore";

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await getAllEvents();
  const featuredEvents = events.slice(0, 6);

  return (
    <main>
      <section className="hero-top" id="home">
        <div className="site-container">
          <header className="hero-nav">
            <Link href="/" className="brand-mark">
              RA.
            </Link>
            <nav>
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#skills">Skills</a>
              <a href="#portfolio">Projects</a>
              <a href="#contact">Contact</a>
              <Link href="/admin">Admin</Link>
            </nav>
          </header>

          <div className="hero-main">
            <div className="hero-copy">
              <p className="hello-line">Hello, I&apos;m</p>
              <h1>Ruhullah Arefin</h1>
              <h2>Strategic Planner</h2>
              <p className="lead-dark">
                Strategic planner for event activation campaigns with deep
                client servicing experience. I design brand experiences that
                connect business goals with audience engagement.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#portfolio">
                  View My Work
                </a>
                <a className="btn btn-outline-dark" href="#inquiry">
                  Get In Touch
                </a>
              </div>
            </div>

            <aside className="profile-card">
              <Image
                src="https://picsum.photos/seed/ruhullah-profile/420/420"
                alt="Ruhullah Arefin"
                width={240}
                height={240}
                className="profile-avatar"
                priority
              />
              <h3>Strategic Planner</h3>
              <p>Event Activation and Client Servicing</p>
              <small>Dhaka, Bangladesh</small>
            </aside>
          </div>
          <div className="stat-row dark">
            <article>
              <strong>45+</strong>
              <span>Events Delivered</span>
            </article>
            <article>
              <strong>80K+</strong>
              <span>Audience Touchpoints</span>
            </article>
            <article>
              <strong>18</strong>
              <span>Cities Activated</span>
            </article>
          </div>
        </div>
      </section>

      <section className="site-container section-gap" id="portfolio">
        <div className="section-header">
          <p className="eyebrow">Featured Work</p>
          <h2>Selected Event Activations</h2>
        </div>
        <div className="event-grid">
          {featuredEvents.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
        <div className="section-cta">
          <Link className="btn btn-dark" href="/events">
            See All Events
          </Link>
        </div>
      </section>

      <section className="site-container section-gap two-col" id="skills">
        <div>
          <p className="eyebrow">What I Do</p>
          <h2>Strategic Planning with Reliable Client Servicing</h2>
          <p>
            From ideation to on-ground execution, I coordinate teams,
            production, and stakeholder communication so campaigns run cleanly
            and deliver meaningful audience engagement.
          </p>
        </div>
        <ul className="service-list">
          <li>Activation concept planning and rollout</li>
          <li>Vendor and timeline management</li>
          <li>Brand and client communication handling</li>
          <li>Audience engagement tracking and reporting</li>
        </ul>
      </section>

      <section className="site-container section-gap" id="about">
        <div className="section-header">
          <p className="eyebrow">About</p>
          <h2>Planner Mindset with Execution Discipline</h2>
          <p>
            I work as a strategic planner in event management, translating
            campaign goals into immersive live experiences while protecting
            timelines, budgets, and stakeholder confidence.
          </p>
        </div>
      </section>

      <section className="site-container section-gap" id="contact">
        <div className="section-header">
          <p className="eyebrow">Social and Contact</p>
          <h2>Let&apos;s Connect</h2>
        </div>
        <div className="social-grid">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="mailto:contact@example.com">Email</a>
          <a href="https://wa.me/8801000000000" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </section>

      <section className="site-container section-gap inquiry" id="inquiry">
        <div className="section-header">
          <p className="eyebrow">Contact Us</p>
          <h2>Tell Me About Your Next Event</h2>
        </div>
        <form className="inquiry-form">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" placeholder="Your full name" />

          <label htmlFor="email">Work Email</label>
          <input id="email" type="email" name="email" placeholder="name@company.com" />

          <label htmlFor="company">Company</label>
          <input id="company" name="company" placeholder="Brand or company" />

          <label htmlFor="details">Project Query</label>
          <textarea
            id="details"
            name="details"
            rows={5}
            placeholder="Share your event objective, expected audience size, and timeline."
          />

          <button type="submit" className="btn btn-primary">
            Submit Inquiry
          </button>
        </form>
      </section>
    </main>
  );
}
