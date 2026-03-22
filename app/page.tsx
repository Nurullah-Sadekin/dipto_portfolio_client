import { PortfolioClient } from "@/components/PortfolioClient";
import { getVisibleProjects } from "@/lib/projectStore";
import { getSiteSettings } from "@/lib/siteSettingsStore";

export default async function Home() {
  const [projects, settings] = await Promise.all([
    getVisibleProjects(),
    getSiteSettings(),
  ]);

  return <PortfolioClient projects={projects} settings={settings} />;
}
