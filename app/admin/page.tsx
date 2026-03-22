import { AdminPanelClient } from "@/components/AdminPanelClient";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getAllEvents } from "@/lib/eventStore";
import { getSiteContent } from "@/lib/siteContentStore";

export default async function AdminPage() {
  const events = await getAllEvents();
  const siteContent = await getSiteContent();
  const initialAuthenticated = await isAdminAuthenticated();

  return (
    <AdminPanelClient
      initialAuthenticated={initialAuthenticated}
      initialEvents={events}
      initialSiteContent={siteContent}
    />
  );
}
