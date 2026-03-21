import { AdminPanelClient } from "@/components/AdminPanelClient";
import { getAllEvents } from "@/lib/eventStore";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const events = await getAllEvents();
  return <AdminPanelClient initialEvents={events} />;
}
