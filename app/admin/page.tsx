import { AdminPortalClient } from "@/components/AdminPortalClient";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getAllLeads } from "@/lib/leadStore";
import { getAllProjects } from "@/lib/projectStore";
import { getSiteSettings } from "@/lib/siteSettingsStore";

export default async function AdminPage() {
  const [projects, leads, settings] = await Promise.all([
    getAllProjects(),
    getAllLeads(),
    getSiteSettings(),
  ]);
  const initialAuthenticated = await isAdminAuthenticated();

  return (
    <AdminPortalClient
      initialAuthenticated={initialAuthenticated}
      initialLeads={leads}
      initialProjects={projects}
      initialSettings={settings}
    />
  );
}
