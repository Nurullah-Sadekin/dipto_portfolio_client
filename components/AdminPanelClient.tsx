"use client";

import { useMemo, useState } from "react";
import type { EventItem } from "@/lib/events";

type FormState = EventItem;

type AdminPanelClientProps = {
  initialEvents: EventItem[];
};

const EMPTY_FORM: FormState = {
  slug: "",
  name: "",
  shortDescription: "",
  location: "",
  client: "",
  attendees: "",
  experience: "",
  clientFeedback: "",
  coverImage: "",
  gallery: [],
};

export function AdminPanelClient({ initialEvents }: AdminPanelClientProps) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const isAuthenticated = useMemo(() => authPassword.length > 0, [authPassword]);

  async function refreshEvents() {
    setLoading(true);
    const res = await fetch("/api/events");
    const data = (await res.json()) as EventItem[];
    setEvents(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  function headers() {
    return {
      "Content-Type": "application/json",
      "x-admin-password": authPassword,
    };
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingSlug(null);
  }

  function onGalleryChange(value: string) {
    setForm((prev) => ({
      ...prev,
      gallery: value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    }));
  }

  function onEdit(event: EventItem) {
    setForm(event);
    setEditingSlug(event.slug);
  }

  async function onDelete(slug: string) {
    if (!isAuthenticated) {
      setMessage("Login first to delete events.");
      return;
    }

    const res = await fetch(`/api/events/${slug}`, {
      method: "DELETE",
      headers: headers(),
    });

    if (!res.ok) {
      const payload = await res.json();
      setMessage(payload.error ?? "Delete failed.");
      return;
    }

    setMessage("Event deleted.");
    await refreshEvents();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAuthenticated) {
      setMessage("Please login with admin password first.");
      return;
    }

    const url = editingSlug ? `/api/events/${editingSlug}` : "/api/events";
    const method = editingSlug ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: headers(),
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const payload = await res.json();
      setMessage(payload.error ?? "Save failed.");
      return;
    }

    setMessage(editingSlug ? "Event updated." : "Event created.");
    resetForm();
    await refreshEvents();
  }

  function onLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthPassword(password.trim());
    setPassword("");
    setMessage("Password captured. You can now create and update events.");
  }

  return (
    <main className="site-container section-gap admin-wrap">
      <div className="section-header">
        <p className="eyebrow">Admin Panel</p>
        <h1>Event Data Manager</h1>
        <p>
          Use this panel to add, edit, or delete event entries used in the
          portfolio pages.
        </p>
      </div>

      <form className="admin-login" onSubmit={onLogin}>
        <label htmlFor="admin-password">Admin Password</label>
        <input
          autoComplete="current-password"
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
        />
        <button className="btn btn-dark" type="submit">
          Unlock Editing
        </button>
      </form>

      {message && <p className="admin-message">{message}</p>}

      <form className="inquiry-form admin-form" onSubmit={onSubmit}>
        <label htmlFor="slug">Slug</label>
        <input
          id="slug"
          value={form.slug}
          onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
          placeholder="event-slug"
        />

        <label htmlFor="name">Event Name</label>
        <input
          id="name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />

        <label htmlFor="shortDescription">Short Description</label>
        <textarea
          id="shortDescription"
          rows={2}
          value={form.shortDescription}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, shortDescription: e.target.value }))
          }
        />

        <div className="admin-grid-two">
          <div>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              value={form.location}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </div>
          <div>
            <label htmlFor="client">Client</label>
            <input
              id="client"
              value={form.client}
              onChange={(e) => setForm((prev) => ({ ...prev, client: e.target.value }))}
            />
          </div>
        </div>

        <label htmlFor="attendees">Attendees</label>
        <input
          id="attendees"
          value={form.attendees}
          onChange={(e) => setForm((prev) => ({ ...prev, attendees: e.target.value }))}
        />

        <label htmlFor="experience">Experience</label>
        <textarea
          id="experience"
          rows={4}
          value={form.experience}
          onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))}
        />

        <label htmlFor="clientFeedback">Client Feedback</label>
        <textarea
          id="clientFeedback"
          rows={3}
          value={form.clientFeedback}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, clientFeedback: e.target.value }))
          }
        />

        <label htmlFor="coverImage">Cover Image URL</label>
        <input
          id="coverImage"
          value={form.coverImage}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, coverImage: e.target.value }))
          }
        />

        <label htmlFor="gallery">Gallery URLs (one per line)</label>
        <textarea
          id="gallery"
          rows={5}
          value={form.gallery.join("\n")}
          onChange={(e) => onGalleryChange(e.target.value)}
        />

        <div className="admin-actions">
          <button className="btn btn-primary" type="submit">
            {editingSlug ? "Update Event" : "Create Event"}
          </button>
          <button className="btn btn-outline" type="button" onClick={resetForm}>
            Clear Form
          </button>
        </div>
      </form>

      <section className="admin-list">
        <h2>Existing Events</h2>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div className="admin-event-grid">
            {events.map((event) => (
              <article key={event.slug}>
                <h3>{event.name}</h3>
                <p>{event.shortDescription}</p>
                <small>{event.slug}</small>
                <div className="admin-actions">
                  <button className="btn btn-dark" onClick={() => onEdit(event)}>
                    Edit
                  </button>
                  <button className="btn btn-outline" onClick={() => onDelete(event.slug)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
