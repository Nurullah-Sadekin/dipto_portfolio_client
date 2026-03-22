import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import type { LeadStatus } from "@/lib/leads";
import { updateLeadStatus } from "@/lib/leadStore";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = (await request.json()) as { status?: LeadStatus };

    if (body.status !== "pending" && body.status !== "read") {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const updated = await updateLeadStatus(id, body.status);

    if (!updated) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update lead." }, { status: 400 });
  }
}
