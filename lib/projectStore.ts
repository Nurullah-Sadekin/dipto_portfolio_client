import { promises as fs } from "node:fs";
import path from "node:path";
import { projects as seedProjects, type ProjectItem } from "@/lib/projects";

const DATA_DIR = process.env.VERCEL
  ? "/tmp/portfolio-data"
  : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "projects.json");

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(seedProjects, null, 2), "utf-8");
  }
}

async function writeProjects(projects: ProjectItem[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

export async function getAllProjects(): Promise<ProjectItem[]> {
  await ensureDataFile();

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as ProjectItem[];
    return Array.isArray(parsed) ? parsed : seedProjects;
  } catch {
    return seedProjects;
  }
}

export async function getVisibleProjects(): Promise<ProjectItem[]> {
  const projects = await getAllProjects();
  return projects.filter((project) => project.visible);
}

export async function createProject(input: ProjectItem): Promise<ProjectItem> {
  const projects = await getAllProjects();
  const slug = slugify(input.slug || input.title);

  if (projects.some((project) => project.slug === slug)) {
    throw new Error("A project with this slug already exists.");
  }

  const payload: ProjectItem = {
    ...input,
    slug,
  };

  projects.push(payload);
  await writeProjects(projects);
  return payload;
}

export async function updateProject(
  slug: string,
  updates: Partial<ProjectItem>,
): Promise<ProjectItem | null> {
  const projects = await getAllProjects();
  const index = projects.findIndex((project) => project.slug === slug);

  if (index === -1) {
    return null;
  }

  const nextSlug = updates.slug ? slugify(updates.slug) : projects[index].slug;
  if (
    nextSlug !== slug &&
    projects.some((project, projectIndex) => {
      return projectIndex !== index && project.slug === nextSlug;
    })
  ) {
    throw new Error("Another project already uses that slug.");
  }

  const updated: ProjectItem = {
    ...projects[index],
    ...updates,
    slug: nextSlug,
  };

  projects[index] = updated;
  await writeProjects(projects);
  return updated;
}

export async function deleteProject(slug: string): Promise<boolean> {
  const projects = await getAllProjects();
  const filtered = projects.filter((project) => project.slug !== slug);

  if (filtered.length === projects.length) {
    return false;
  }

  await writeProjects(filtered);
  return true;
}
