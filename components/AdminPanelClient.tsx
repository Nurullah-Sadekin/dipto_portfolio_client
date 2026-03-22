"use client";

import { useState } from "react";
import type { EventItem } from "@/lib/events";

type FormState = EventItem;

type AdminPanelClientProps = {
  initialAuthenticated: boolean;
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

export function AdminPanelClient({
  initialAuthenticated,
  initialEvents,
}: AdminPanelClientProps) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  async function refreshEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = (await res.json()) as EventItem[];
      setEvents(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
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
      setAuthError("Please log in before deleting events.");
      return;
    }

    const res = await fetch(`/api/events/${slug}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const payload = await res.json();
      if (res.status === 401) {
        setIsAuthenticated(false);
        setAuthError("Your session expired. Please log in again.");
        return;
      }
      setMessage(payload.error ?? "Delete failed.");
      return;
    }

    setAuthError("");
    setMessage("Event deleted.");
    await refreshEvents();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAuthenticated) {
      setAuthError("Please log in before saving events.");
      return;
    }

    const url = editingSlug ? `/api/events/${editingSlug}` : "/api/events";
    const method = editingSlug ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const payload = await res.json();
      if (res.status === 401) {
        setIsAuthenticated(false);
        setAuthError("Your session expired. Please log in again.");
        return;
      }
      setMessage(payload.error ?? "Save failed.");
      return;
    }

    setAuthError("");
    setMessage(editingSlug ? "Event updated." : "Event created.");
    resetForm();
    await refreshEvents();
  }

  function onLogin(event: React.FormEvent<HTMLFormElement>) {
    void handleLogin(event);
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setAuthError("");

    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      setAuthError("Username and password are required.");
      return;
    }

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: trimmedUsername,
        password,
      }),
    });

    const payload = (await res.json()) as { error?: string };

    if (!res.ok) {
      setIsAuthenticated(false);
      setAuthError(payload.error ?? "Username or password does not match.");
      return;
    }

    setIsAuthenticated(true);
    setUsername("");
    setPassword("");
    setAuthError("");
    setMessage("Admin access granted. You can now manage events.");
    await refreshEvents();
  }

  async function onLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setAuthError("");
    setMessage("You have been logged out.");
    resetForm();
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

      {!isAuthenticated ? (
        <section className="admin-auth-card">
          <div className="section-header">
            <p className="eyebrow">Secure Login</p>
            <h2>Admin Authentication</h2>
            <p>Sign in with your admin username and password to unlock editing.</p>
          </div>

          <form className="admin-login" onSubmit={onLogin}>
            <label htmlFor="admin-username">Username</label>
            <input
              autoComplete="username"
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />

            <label htmlFor="admin-password">Password</label>
            <input
              autoComplete="current-password"
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />

            <button className="btn btn-dark" type="submit">
              Login
            </button>
          </form>

          {authError && <p className="admin-error">{authError}</p>}
          {message && <p className="admin-message">{message}</p>}
        </section>
      ) : (
        <section className="admin-auth-status">
          <p className="admin-message">Authenticated as admin.</p>
          <button className="btn btn-outline" type="button" onClick={onLogout}>
            Logout
          </button>
        </section>
      )}

      {isAuthenticated && message && <p className="admin-message">{message}</p>}
      {isAuthenticated && authError && <p className="admin-error">{authError}</p>}

      {isAuthenticated && (
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
            onChange={(e) =>
              setForm((prev) => ({ ...prev, attendees: e.target.value }))
            }
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
      )}

      {isAuthenticated && (
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
                    <button
                      className="btn btn-dark"
                      type="button"
                      onClick={() => onEdit(event)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => onDelete(event.slug)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
