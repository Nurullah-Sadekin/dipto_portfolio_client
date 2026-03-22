"use client";

import { useState } from "react";
import type { EventItem } from "@/lib/events";
import type { SiteContent, SiteLinkItem, SiteNavItem, SiteStatItem } from "@/lib/siteContent";

type FormState = EventItem;

type SiteContentFormState = {
  metadataTitle: string;
  metadataDescription: string;
  brandMark: string;
  navLinks: string;
  heroGreeting: string;
  heroName: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryLabel: string;
  heroPrimaryHref: string;
  heroSecondaryLabel: string;
  heroSecondaryHref: string;
  profileImage: string;
  profileImageAlt: string;
  profileTitle: string;
  profileSubtitle: string;
  profileLocation: string;
  stats: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredButtonLabel: string;
  featuredCount: string;
  skillsEyebrow: string;
  skillsTitle: string;
  skillsDescription: string;
  skillsItems: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutDescription: string;
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
  contactLinks: string;
  inquiryEyebrow: string;
  inquiryTitle: string;
  inquiryNameLabel: string;
  inquiryNamePlaceholder: string;
  inquiryEmailLabel: string;
  inquiryEmailPlaceholder: string;
  inquiryCompanyLabel: string;
  inquiryCompanyPlaceholder: string;
  inquiryDetailsLabel: string;
  inquiryDetailsPlaceholder: string;
  inquiryButtonLabel: string;
  eventsPageEyebrow: string;
  eventsPageTitle: string;
  eventsPageDescription: string;
  eventsPageBackButtonLabel: string;
  detailEyebrow: string;
  detailLocationLabel: string;
  detailClientLabel: string;
  detailAttendeesLabel: string;
  detailExperienceTitle: string;
  detailGalleryTitle: string;
  detailFeedbackTitle: string;
  detailBackButtonLabel: string;
};

type AdminPanelClientProps = {
  initialAuthenticated: boolean;
  initialEvents: EventItem[];
  initialSiteContent: SiteContent;
};

type PairParseResult =
  | {
      pairs: [string, string][];
    }
  | {
      error: string;
    };

type SiteContentBuildResult =
  | {
      payload: SiteContent;
    }
  | {
      error: string;
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

function linesToText(lines: string[]) {
  return lines.join("\n");
}

function navLinksToText(items: SiteNavItem[]) {
  return items.map((item) => `${item.label}|${item.href}`).join("\n");
}

function statItemsToText(items: SiteStatItem[]) {
  return items.map((item) => `${item.value}|${item.label}`).join("\n");
}

function linkItemsToText(items: SiteLinkItem[]) {
  return items.map((item) => `${item.label}|${item.href}`).join("\n");
}

function toSiteContentFormState(content: SiteContent): SiteContentFormState {
  return {
    metadataTitle: content.metadataTitle,
    metadataDescription: content.metadataDescription,
    brandMark: content.brandMark,
    navLinks: navLinksToText(content.navLinks),
    heroGreeting: content.hero.greeting,
    heroName: content.hero.name,
    heroTitle: content.hero.title,
    heroDescription: content.hero.description,
    heroPrimaryLabel: content.hero.primaryCtaLabel,
    heroPrimaryHref: content.hero.primaryCtaHref,
    heroSecondaryLabel: content.hero.secondaryCtaLabel,
    heroSecondaryHref: content.hero.secondaryCtaHref,
    profileImage: content.profile.image,
    profileImageAlt: content.profile.imageAlt,
    profileTitle: content.profile.title,
    profileSubtitle: content.profile.subtitle,
    profileLocation: content.profile.location,
    stats: statItemsToText(content.stats),
    featuredEyebrow: content.featuredWork.eyebrow,
    featuredTitle: content.featuredWork.title,
    featuredButtonLabel: content.featuredWork.buttonLabel,
    featuredCount: String(content.featuredWork.count),
    skillsEyebrow: content.skills.eyebrow,
    skillsTitle: content.skills.title,
    skillsDescription: content.skills.description,
    skillsItems: linesToText(content.skills.items),
    aboutEyebrow: content.about.eyebrow,
    aboutTitle: content.about.title,
    aboutDescription: content.about.description,
    contactEyebrow: content.contact.eyebrow,
    contactTitle: content.contact.title,
    contactDescription: content.contact.description,
    contactLinks: linkItemsToText(content.contact.links),
    inquiryEyebrow: content.inquiry.eyebrow,
    inquiryTitle: content.inquiry.title,
    inquiryNameLabel: content.inquiry.nameLabel,
    inquiryNamePlaceholder: content.inquiry.namePlaceholder,
    inquiryEmailLabel: content.inquiry.emailLabel,
    inquiryEmailPlaceholder: content.inquiry.emailPlaceholder,
    inquiryCompanyLabel: content.inquiry.companyLabel,
    inquiryCompanyPlaceholder: content.inquiry.companyPlaceholder,
    inquiryDetailsLabel: content.inquiry.detailsLabel,
    inquiryDetailsPlaceholder: content.inquiry.detailsPlaceholder,
    inquiryButtonLabel: content.inquiry.buttonLabel,
    eventsPageEyebrow: content.eventsPage.eyebrow,
    eventsPageTitle: content.eventsPage.title,
    eventsPageDescription: content.eventsPage.description,
    eventsPageBackButtonLabel: content.eventsPage.backButtonLabel,
    detailEyebrow: content.eventDetail.eyebrow,
    detailLocationLabel: content.eventDetail.locationLabel,
    detailClientLabel: content.eventDetail.clientLabel,
    detailAttendeesLabel: content.eventDetail.attendeesLabel,
    detailExperienceTitle: content.eventDetail.experienceTitle,
    detailGalleryTitle: content.eventDetail.galleryTitle,
    detailFeedbackTitle: content.eventDetail.feedbackTitle,
    detailBackButtonLabel: content.eventDetail.backButtonLabel,
  };
}

function parseLinePairs(value: string, pairName: string): PairParseResult {
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { error: `Please provide at least one ${pairName}.` as const };
  }

  const pairs = lines.map(
    (line) => line.split("|").map((item) => item.trim()) as [string, string],
  );
  if (pairs.some((pair) => pair.length !== 2 || !pair[0] || !pair[1])) {
    return {
      error: `Each ${pairName} line must use the format value|label.` as const,
    };
  }

  return { pairs };
}

function buildSiteContentPayload(form: SiteContentFormState): SiteContentBuildResult {
  const navLinks = parseLinePairs(form.navLinks, "navigation item");
  if ("error" in navLinks) {
    return navLinks;
  }

  const stats = parseLinePairs(form.stats, "stat item");
  if ("error" in stats) {
    return stats;
  }

  const contactLinks = parseLinePairs(form.contactLinks, "contact link");
  if ("error" in contactLinks) {
    return contactLinks;
  }

  const skillsItems = form.skillsItems
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (skillsItems.length === 0) {
    return { error: "Please provide at least one skill item." as const };
  }

  const featuredCount = Number(form.featuredCount);
  if (!Number.isInteger(featuredCount) || featuredCount < 1) {
    return { error: "Featured event count must be a whole number greater than 0." as const };
  }

  const payload: SiteContent = {
    metadataTitle: form.metadataTitle.trim(),
    metadataDescription: form.metadataDescription.trim(),
    brandMark: form.brandMark.trim(),
    navLinks: navLinks.pairs.map(([label, href]) => ({ label, href })),
    hero: {
      greeting: form.heroGreeting.trim(),
      name: form.heroName.trim(),
      title: form.heroTitle.trim(),
      description: form.heroDescription.trim(),
      primaryCtaLabel: form.heroPrimaryLabel.trim(),
      primaryCtaHref: form.heroPrimaryHref.trim(),
      secondaryCtaLabel: form.heroSecondaryLabel.trim(),
      secondaryCtaHref: form.heroSecondaryHref.trim(),
    },
    profile: {
      image: form.profileImage.trim(),
      imageAlt: form.profileImageAlt.trim(),
      title: form.profileTitle.trim(),
      subtitle: form.profileSubtitle.trim(),
      location: form.profileLocation.trim(),
    },
    stats: stats.pairs.map(([value, label]) => ({ value, label })),
    featuredWork: {
      eyebrow: form.featuredEyebrow.trim(),
      title: form.featuredTitle.trim(),
      buttonLabel: form.featuredButtonLabel.trim(),
      count: featuredCount,
    },
    skills: {
      eyebrow: form.skillsEyebrow.trim(),
      title: form.skillsTitle.trim(),
      description: form.skillsDescription.trim(),
      items: skillsItems,
    },
    about: {
      eyebrow: form.aboutEyebrow.trim(),
      title: form.aboutTitle.trim(),
      description: form.aboutDescription.trim(),
    },
    contact: {
      eyebrow: form.contactEyebrow.trim(),
      title: form.contactTitle.trim(),
      description: form.contactDescription.trim(),
      links: contactLinks.pairs.map(([label, href]) => ({ label, href })),
    },
    inquiry: {
      eyebrow: form.inquiryEyebrow.trim(),
      title: form.inquiryTitle.trim(),
      nameLabel: form.inquiryNameLabel.trim(),
      namePlaceholder: form.inquiryNamePlaceholder.trim(),
      emailLabel: form.inquiryEmailLabel.trim(),
      emailPlaceholder: form.inquiryEmailPlaceholder.trim(),
      companyLabel: form.inquiryCompanyLabel.trim(),
      companyPlaceholder: form.inquiryCompanyPlaceholder.trim(),
      detailsLabel: form.inquiryDetailsLabel.trim(),
      detailsPlaceholder: form.inquiryDetailsPlaceholder.trim(),
      buttonLabel: form.inquiryButtonLabel.trim(),
    },
    eventsPage: {
      eyebrow: form.eventsPageEyebrow.trim(),
      title: form.eventsPageTitle.trim(),
      description: form.eventsPageDescription.trim(),
      backButtonLabel: form.eventsPageBackButtonLabel.trim(),
    },
    eventDetail: {
      eyebrow: form.detailEyebrow.trim(),
      locationLabel: form.detailLocationLabel.trim(),
      clientLabel: form.detailClientLabel.trim(),
      attendeesLabel: form.detailAttendeesLabel.trim(),
      experienceTitle: form.detailExperienceTitle.trim(),
      galleryTitle: form.detailGalleryTitle.trim(),
      feedbackTitle: form.detailFeedbackTitle.trim(),
      backButtonLabel: form.detailBackButtonLabel.trim(),
    },
  };

  const hasEmptyRequired = [
    payload.metadataTitle,
    payload.metadataDescription,
    payload.brandMark,
    payload.hero.greeting,
    payload.hero.name,
    payload.hero.title,
    payload.hero.description,
    payload.profile.image,
    payload.profile.imageAlt,
    payload.contact.description,
  ].some((value) => !value);

  if (hasEmptyRequired) {
    return { error: "Please fill in all required site content fields." as const };
  }

  return { payload };
}

export function AdminPanelClient({
  initialAuthenticated,
  initialEvents,
  initialSiteContent,
}: AdminPanelClientProps) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [siteContent, setSiteContent] = useState<SiteContent>(initialSiteContent);
  const [siteForm, setSiteForm] = useState<SiteContentFormState>(
    toSiteContentFormState(initialSiteContent),
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [siteMessage, setSiteMessage] = useState("");
  const [siteError, setSiteError] = useState("");
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

  async function refreshSiteContent() {
    const res = await fetch("/api/site-content");
    const data = (await res.json()) as SiteContent;
    setSiteContent(data);
    setSiteForm(toSiteContentFormState(data));
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

  async function onSiteContentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAuthenticated) {
      setSiteError("Please log in before saving site content.");
      return;
    }

    const result = buildSiteContentPayload(siteForm);
    if ("error" in result) {
      setSiteError(result.error ?? "Invalid site content.");
      return;
    }

    const res = await fetch("/api/site-content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.payload),
    });

    const payload = (await res.json()) as SiteContent | { error?: string };

    if (!res.ok) {
      if (res.status === 401) {
        setIsAuthenticated(false);
        setSiteError("Your session expired. Please log in again.");
        return;
      }
      setSiteError(("error" in payload && payload.error) || "Site content save failed.");
      return;
    }

    setSiteContent(payload as SiteContent);
    setSiteForm(toSiteContentFormState(payload as SiteContent));
    setSiteError("");
    setSiteMessage("Customer site content updated.");
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
    setSiteMessage("Admin access granted. You can now update customer site content.");
    await Promise.all([refreshEvents(), refreshSiteContent()]);
  }

  async function onLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setAuthError("");
    setSiteError("");
    setMessage("You have been logged out.");
    setSiteMessage("");
    resetForm();
  }

  return (
    <main className="site-container section-gap admin-wrap">
      <div className="section-header">
        <p className="eyebrow">Admin Panel</p>
        <h1>Portfolio Content Manager</h1>
        <p>
          Update both the customer-facing site content and the event portfolio data
          from one place.
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

      {isAuthenticated && (
        <>
          {message && <p className="admin-message">{message}</p>}
          {authError && <p className="admin-error">{authError}</p>}

          <section className="admin-section">
            <div className="section-header">
              <p className="eyebrow">Customer Site Content</p>
              <h2>Edit Homepage and Public Page Content</h2>
              <p>
                These fields drive the public-facing customer site and are also
                available through the `/api/site-content` endpoint.
              </p>
            </div>

            <form className="inquiry-form admin-form" onSubmit={onSiteContentSubmit}>
              <label htmlFor="metadataTitle">Browser Title</label>
              <input
                id="metadataTitle"
                value={siteForm.metadataTitle}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, metadataTitle: e.target.value }))
                }
              />

              <label htmlFor="metadataDescription">Browser Description</label>
              <textarea
                id="metadataDescription"
                rows={3}
                value={siteForm.metadataDescription}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    metadataDescription: e.target.value,
                  }))
                }
              />

              <label htmlFor="brandMark">Brand Mark</label>
              <input
                id="brandMark"
                value={siteForm.brandMark}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, brandMark: e.target.value }))
                }
              />

              <label htmlFor="navLinks">Navigation Items (`label|href` per line)</label>
              <textarea
                id="navLinks"
                rows={5}
                value={siteForm.navLinks}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, navLinks: e.target.value }))
                }
              />

              <label htmlFor="heroGreeting">Hero Greeting</label>
              <input
                id="heroGreeting"
                value={siteForm.heroGreeting}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, heroGreeting: e.target.value }))
                }
              />

              <label htmlFor="heroName">Hero Name</label>
              <input
                id="heroName"
                value={siteForm.heroName}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, heroName: e.target.value }))
                }
              />

              <label htmlFor="heroTitle">Hero Title</label>
              <input
                id="heroTitle"
                value={siteForm.heroTitle}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, heroTitle: e.target.value }))
                }
              />

              <label htmlFor="heroDescription">Hero Description</label>
              <textarea
                id="heroDescription"
                rows={4}
                value={siteForm.heroDescription}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, heroDescription: e.target.value }))
                }
              />

              <div className="admin-grid-two">
                <div>
                  <label htmlFor="heroPrimaryLabel">Primary CTA Label</label>
                  <input
                    id="heroPrimaryLabel"
                    value={siteForm.heroPrimaryLabel}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        heroPrimaryLabel: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="heroPrimaryHref">Primary CTA Link</label>
                  <input
                    id="heroPrimaryHref"
                    value={siteForm.heroPrimaryHref}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        heroPrimaryHref: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="admin-grid-two">
                <div>
                  <label htmlFor="heroSecondaryLabel">Secondary CTA Label</label>
                  <input
                    id="heroSecondaryLabel"
                    value={siteForm.heroSecondaryLabel}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        heroSecondaryLabel: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="heroSecondaryHref">Secondary CTA Link</label>
                  <input
                    id="heroSecondaryHref"
                    value={siteForm.heroSecondaryHref}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        heroSecondaryHref: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <label htmlFor="profileImage">Profile Image URL</label>
              <input
                id="profileImage"
                value={siteForm.profileImage}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, profileImage: e.target.value }))
                }
              />

              <label htmlFor="profileImageAlt">Profile Image Alt Text</label>
              <input
                id="profileImageAlt"
                value={siteForm.profileImageAlt}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, profileImageAlt: e.target.value }))
                }
              />

              <div className="admin-grid-two">
                <div>
                  <label htmlFor="profileTitle">Profile Title</label>
                  <input
                    id="profileTitle"
                    value={siteForm.profileTitle}
                    onChange={(e) =>
                      setSiteForm((prev) => ({ ...prev, profileTitle: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="profileSubtitle">Profile Subtitle</label>
                  <input
                    id="profileSubtitle"
                    value={siteForm.profileSubtitle}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        profileSubtitle: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <label htmlFor="profileLocation">Profile Location</label>
              <input
                id="profileLocation"
                value={siteForm.profileLocation}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    profileLocation: e.target.value,
                  }))
                }
              />

              <label htmlFor="stats">Stats (`value|label` per line)</label>
              <textarea
                id="stats"
                rows={4}
                value={siteForm.stats}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, stats: e.target.value }))
                }
              />

              <div className="admin-grid-two">
                <div>
                  <label htmlFor="featuredEyebrow">Featured Section Eyebrow</label>
                  <input
                    id="featuredEyebrow"
                    value={siteForm.featuredEyebrow}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        featuredEyebrow: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="featuredTitle">Featured Section Title</label>
                  <input
                    id="featuredTitle"
                    value={siteForm.featuredTitle}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        featuredTitle: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="admin-grid-two">
                <div>
                  <label htmlFor="featuredButtonLabel">Featured Button Label</label>
                  <input
                    id="featuredButtonLabel"
                    value={siteForm.featuredButtonLabel}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        featuredButtonLabel: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="featuredCount">Number of Featured Events</label>
                  <input
                    id="featuredCount"
                    value={siteForm.featuredCount}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        featuredCount: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <label htmlFor="skillsEyebrow">Skills Section Eyebrow</label>
              <input
                id="skillsEyebrow"
                value={siteForm.skillsEyebrow}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, skillsEyebrow: e.target.value }))
                }
              />

              <label htmlFor="skillsTitle">Skills Section Title</label>
              <input
                id="skillsTitle"
                value={siteForm.skillsTitle}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, skillsTitle: e.target.value }))
                }
              />

              <label htmlFor="skillsDescription">Skills Section Description</label>
              <textarea
                id="skillsDescription"
                rows={4}
                value={siteForm.skillsDescription}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    skillsDescription: e.target.value,
                  }))
                }
              />

              <label htmlFor="skillsItems">Skills Items (one per line)</label>
              <textarea
                id="skillsItems"
                rows={5}
                value={siteForm.skillsItems}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, skillsItems: e.target.value }))
                }
              />

              <label htmlFor="aboutEyebrow">About Section Eyebrow</label>
              <input
                id="aboutEyebrow"
                value={siteForm.aboutEyebrow}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, aboutEyebrow: e.target.value }))
                }
              />

              <label htmlFor="aboutTitle">About Section Title</label>
              <input
                id="aboutTitle"
                value={siteForm.aboutTitle}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, aboutTitle: e.target.value }))
                }
              />

              <label htmlFor="aboutDescription">About Section Description</label>
              <textarea
                id="aboutDescription"
                rows={4}
                value={siteForm.aboutDescription}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    aboutDescription: e.target.value,
                  }))
                }
              />

              <label htmlFor="contactEyebrow">Contact Section Eyebrow</label>
              <input
                id="contactEyebrow"
                value={siteForm.contactEyebrow}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    contactEyebrow: e.target.value,
                  }))
                }
              />

              <label htmlFor="contactTitle">Contact Section Title</label>
              <input
                id="contactTitle"
                value={siteForm.contactTitle}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, contactTitle: e.target.value }))
                }
              />

              <label htmlFor="contactDescription">Contact Section Description</label>
              <textarea
                id="contactDescription"
                rows={3}
                value={siteForm.contactDescription}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    contactDescription: e.target.value,
                  }))
                }
              />

              <label htmlFor="contactLinks">Contact Links (`label|href` per line)</label>
              <textarea
                id="contactLinks"
                rows={5}
                value={siteForm.contactLinks}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    contactLinks: e.target.value,
                  }))
                }
              />

              <label htmlFor="inquiryEyebrow">Inquiry Section Eyebrow</label>
              <input
                id="inquiryEyebrow"
                value={siteForm.inquiryEyebrow}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    inquiryEyebrow: e.target.value,
                  }))
                }
              />

              <label htmlFor="inquiryTitle">Inquiry Section Title</label>
              <input
                id="inquiryTitle"
                value={siteForm.inquiryTitle}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, inquiryTitle: e.target.value }))
                }
              />

              <div className="admin-grid-two">
                <div>
                  <label htmlFor="inquiryNameLabel">Name Field Label</label>
                  <input
                    id="inquiryNameLabel"
                    value={siteForm.inquiryNameLabel}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        inquiryNameLabel: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="inquiryNamePlaceholder">Name Field Placeholder</label>
                  <input
                    id="inquiryNamePlaceholder"
                    value={siteForm.inquiryNamePlaceholder}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        inquiryNamePlaceholder: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="admin-grid-two">
                <div>
                  <label htmlFor="inquiryEmailLabel">Email Field Label</label>
                  <input
                    id="inquiryEmailLabel"
                    value={siteForm.inquiryEmailLabel}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        inquiryEmailLabel: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="inquiryEmailPlaceholder">
                    Email Field Placeholder
                  </label>
                  <input
                    id="inquiryEmailPlaceholder"
                    value={siteForm.inquiryEmailPlaceholder}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        inquiryEmailPlaceholder: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="admin-grid-two">
                <div>
                  <label htmlFor="inquiryCompanyLabel">Company Field Label</label>
                  <input
                    id="inquiryCompanyLabel"
                    value={siteForm.inquiryCompanyLabel}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        inquiryCompanyLabel: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="inquiryCompanyPlaceholder">
                    Company Field Placeholder
                  </label>
                  <input
                    id="inquiryCompanyPlaceholder"
                    value={siteForm.inquiryCompanyPlaceholder}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        inquiryCompanyPlaceholder: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="admin-grid-two">
                <div>
                  <label htmlFor="inquiryDetailsLabel">Details Field Label</label>
                  <input
                    id="inquiryDetailsLabel"
                    value={siteForm.inquiryDetailsLabel}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        inquiryDetailsLabel: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="inquiryButtonLabel">Inquiry Button Label</label>
                  <input
                    id="inquiryButtonLabel"
                    value={siteForm.inquiryButtonLabel}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        inquiryButtonLabel: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <label htmlFor="inquiryDetailsPlaceholder">Details Placeholder</label>
              <textarea
                id="inquiryDetailsPlaceholder"
                rows={3}
                value={siteForm.inquiryDetailsPlaceholder}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    inquiryDetailsPlaceholder: e.target.value,
                  }))
                }
              />

              <label htmlFor="eventsPageEyebrow">Events Page Eyebrow</label>
              <input
                id="eventsPageEyebrow"
                value={siteForm.eventsPageEyebrow}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    eventsPageEyebrow: e.target.value,
                  }))
                }
              />

              <label htmlFor="eventsPageTitle">Events Page Title</label>
              <input
                id="eventsPageTitle"
                value={siteForm.eventsPageTitle}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    eventsPageTitle: e.target.value,
                  }))
                }
              />

              <label htmlFor="eventsPageDescription">Events Page Description</label>
              <textarea
                id="eventsPageDescription"
                rows={3}
                value={siteForm.eventsPageDescription}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    eventsPageDescription: e.target.value,
                  }))
                }
              />

              <label htmlFor="eventsPageBackButtonLabel">Events Page Button Label</label>
              <input
                id="eventsPageBackButtonLabel"
                value={siteForm.eventsPageBackButtonLabel}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    eventsPageBackButtonLabel: e.target.value,
                  }))
                }
              />

              <label htmlFor="detailEyebrow">Event Detail Eyebrow</label>
              <input
                id="detailEyebrow"
                value={siteForm.detailEyebrow}
                onChange={(e) =>
                  setSiteForm((prev) => ({ ...prev, detailEyebrow: e.target.value }))
                }
              />

              <div className="admin-grid-two">
                <div>
                  <label htmlFor="detailLocationLabel">Location Label</label>
                  <input
                    id="detailLocationLabel"
                    value={siteForm.detailLocationLabel}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        detailLocationLabel: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="detailClientLabel">Client Label</label>
                  <input
                    id="detailClientLabel"
                    value={siteForm.detailClientLabel}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        detailClientLabel: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="admin-grid-two">
                <div>
                  <label htmlFor="detailAttendeesLabel">Attendees Label</label>
                  <input
                    id="detailAttendeesLabel"
                    value={siteForm.detailAttendeesLabel}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        detailAttendeesLabel: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="detailBackButtonLabel">Back Button Label</label>
                  <input
                    id="detailBackButtonLabel"
                    value={siteForm.detailBackButtonLabel}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        detailBackButtonLabel: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="admin-grid-two">
                <div>
                  <label htmlFor="detailExperienceTitle">Experience Section Title</label>
                  <input
                    id="detailExperienceTitle"
                    value={siteForm.detailExperienceTitle}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        detailExperienceTitle: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="detailGalleryTitle">Gallery Section Title</label>
                  <input
                    id="detailGalleryTitle"
                    value={siteForm.detailGalleryTitle}
                    onChange={(e) =>
                      setSiteForm((prev) => ({
                        ...prev,
                        detailGalleryTitle: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <label htmlFor="detailFeedbackTitle">Feedback Section Title</label>
              <input
                id="detailFeedbackTitle"
                value={siteForm.detailFeedbackTitle}
                onChange={(e) =>
                  setSiteForm((prev) => ({
                    ...prev,
                    detailFeedbackTitle: e.target.value,
                  }))
                }
              />

              <div className="admin-actions">
                <button className="btn btn-primary" type="submit">
                  Save Customer Site Content
                </button>
              </div>
            </form>

            {siteMessage && <p className="admin-message">{siteMessage}</p>}
            {siteError && <p className="admin-error">{siteError}</p>}
            <p className="admin-preview-note">
              Current public site title: <strong>{siteContent.metadataTitle}</strong>
            </p>
          </section>

          <section className="admin-section">
            <div className="section-header">
              <p className="eyebrow">Events API Content</p>
              <h2>Manage Event Portfolio</h2>
              <p>
                These entries are served by the existing events APIs and displayed on
                the customer site cards and event detail pages.
              </p>
            </div>

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
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, client: e.target.value }))
                    }
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
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, experience: e.target.value }))
                }
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
          </section>
        </>
      )}
    </main>
  );
}
