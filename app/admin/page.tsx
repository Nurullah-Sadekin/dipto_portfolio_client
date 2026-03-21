import { AdminPanelClient } from "@/components/AdminPanelClient";
import { getAllEvents } from "@/lib/eventStore";

export default async function AdminPage() {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return (
      <main className="site-container section-gap admin-wrap">
        <div className="section-header">
          <p className="eyebrow">Admin Panel</p>
          <h1>Unavailable on GitHub Pages</h1>
          <p>
            Admin editing uses server APIs and writable storage, which are not
            available on static GitHub Pages hosting.
          </p>
        </div>
      </main>
    );
  }

  const events = await getAllEvents();
  return <AdminPanelClient initialEvents={events} />;
}
