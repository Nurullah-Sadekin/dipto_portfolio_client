import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { createLead, getAllLeads } from "@/lib/leadStore";

type LeadPayload = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
};

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await getAllLeads();
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json({ error: "Failed to load leads." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadPayload;

    if (!body.name || !body.email || !body.company || !body.message) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const created = await createLead({
      name: body.name.trim(),
      email: body.email.trim(),
      company: body.company.trim(),
      message: body.message.trim(),
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create lead." }, { status: 400 });
  }
}
