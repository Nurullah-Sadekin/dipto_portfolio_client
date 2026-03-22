import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { createProject, getAllProjects, getVisibleProjects } from "@/lib/projectStore";
import type { ProjectItem } from "@/lib/projects";

function hasRequiredFields(input: Partial<ProjectItem>) {
  return (
    !!input.slug &&
    !!input.title &&
    !!input.description &&
    !!input.impactMetric &&
    Array.isArray(input.categoryTags) &&
    typeof input.visible === "boolean"
  );
}

export async function GET(request: NextRequest) {
  try {
    const includeHidden = request.nextUrl.searchParams.get("includeHidden") === "true";
    const projects = includeHidden
      ? await getAllProjects()
      : await getVisibleProjects();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to load projects." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<ProjectItem>;
    if (!hasRequiredFields(body)) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const created = await createProject(body as ProjectItem);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create project.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
