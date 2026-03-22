import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { LeadMessage, LeadStatus } from "@/lib/leads";

const DATA_DIR = process.env.VERCEL
  ? "/tmp/portfolio-data"
  : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "leads.json");

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

async function writeLeads(leads: LeadMessage[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

export async function getAllLeads(): Promise<LeadMessage[]> {
  await ensureDataFile();

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as LeadMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function createLead(
  input: Omit<LeadMessage, "id" | "status" | "createdAt">,
): Promise<LeadMessage> {
  const leads = await getAllLeads();
  const payload: LeadMessage = {
    id: randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
    ...input,
  };

  leads.unshift(payload);
  await writeLeads(leads);
  return payload;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<LeadMessage | null> {
  const leads = await getAllLeads();
  const index = leads.findIndex((lead) => lead.id === id);

  if (index === -1) {
    return null;
  }

  const updated = {
    ...leads[index],
    status,
  };

  leads[index] = updated;
  await writeLeads(leads);
  return updated;
}
