import { AdminPanelClient } from "@/components/AdminPanelClient";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getAllEvents } from "@/lib/eventStore";

export default async function AdminPage() {
  const events = await getAllEvents();
  const initialAuthenticated = await isAdminAuthenticated();

  return (
    <AdminPanelClient
      initialAuthenticated={initialAuthenticated}
      initialEvents={events}
    />
  );
}
