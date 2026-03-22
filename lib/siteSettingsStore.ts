import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultSiteSettings, type SiteSettings } from "@/lib/siteSettings";

const DATA_DIR = process.env.VERCEL
  ? "/tmp/portfolio-data"
  : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site-settings.json");

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultSiteSettings, null, 2), "utf-8");
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await ensureDataFile();

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;

    return {
      ...defaultSiteSettings,
      ...parsed,
      stackFilterLabels: {
        ...defaultSiteSettings.stackFilterLabels,
        ...parsed.stackFilterLabels,
      },
      impactCounters: Array.isArray(parsed.impactCounters)
        ? parsed.impactCounters
        : defaultSiteSettings.impactCounters,
      processSteps: Array.isArray(parsed.processSteps)
        ? parsed.processSteps
        : defaultSiteSettings.processSteps,
      strategyItems: Array.isArray(parsed.strategyItems)
        ? parsed.strategyItems
        : defaultSiteSettings.strategyItems,
    };
  } catch {
    return defaultSiteSettings;
  }
}

export async function updateSiteSettings(
  settings: SiteSettings,
): Promise<SiteSettings> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(settings, null, 2), "utf-8");
  return settings;
}
