import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultSiteContent, type SiteContent } from "@/lib/siteContent";

const DATA_DIR = process.env.VERCEL
  ? "/tmp/portfolio-data"
  : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site-content.json");

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultSiteContent, null, 2), "utf-8");
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  await ensureDataFile();

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      ...defaultSiteContent,
      ...parsed,
      hero: {
        ...defaultSiteContent.hero,
        ...parsed.hero,
      },
      profile: {
        ...defaultSiteContent.profile,
        ...parsed.profile,
      },
      featuredWork: {
        ...defaultSiteContent.featuredWork,
        ...parsed.featuredWork,
      },
      skills: {
        ...defaultSiteContent.skills,
        ...parsed.skills,
        items: Array.isArray(parsed.skills?.items)
          ? parsed.skills.items
          : defaultSiteContent.skills.items,
      },
      about: {
        ...defaultSiteContent.about,
        ...parsed.about,
      },
      contact: {
        ...defaultSiteContent.contact,
        ...parsed.contact,
        links: Array.isArray(parsed.contact?.links)
          ? parsed.contact.links
          : defaultSiteContent.contact.links,
      },
      inquiry: {
        ...defaultSiteContent.inquiry,
        ...parsed.inquiry,
      },
      eventsPage: {
        ...defaultSiteContent.eventsPage,
        ...parsed.eventsPage,
      },
      eventDetail: {
        ...defaultSiteContent.eventDetail,
        ...parsed.eventDetail,
      },
      navLinks: Array.isArray(parsed.navLinks)
        ? parsed.navLinks
        : defaultSiteContent.navLinks,
      stats: Array.isArray(parsed.stats) ? parsed.stats : defaultSiteContent.stats,
    };
  } catch {
    return defaultSiteContent;
  }
}

export async function updateSiteContent(content: SiteContent): Promise<SiteContent> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(content, null, 2), "utf-8");
  return content;
}
