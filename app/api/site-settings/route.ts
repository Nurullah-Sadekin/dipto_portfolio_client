import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import type { SiteSettings } from "@/lib/siteSettings";
import { getSiteSettings, updateSiteSettings } from "@/lib/siteSettingsStore";

function isValidSiteSettings(input: Partial<SiteSettings>): input is SiteSettings {
  return (
    !!input.metadataTitle &&
    !!input.metadataDescription &&
    !!input.brandName &&
    !!input.heroHeadline &&
    !!input.heroDescription &&
    !!input.heroPrimaryCtaLabel &&
    !!input.heroSecondaryCtaLabel &&
    !!input.heroPrimaryCtaHref &&
    !!input.heroSecondaryCtaHref &&
    !!input.processHeading &&
    !!input.processSubheading &&
    !!input.portfolioHeading &&
    !!input.portfolioSubheading &&
    !!input.stackHeading &&
    !!input.stackSubheading &&
    !!input.stackFilterLabels?.all &&
    !!input.stackFilterLabels?.methodology &&
    !!input.stackFilterLabels?.techTool &&
    !!input.ctaHeading &&
    !!input.ctaDescription &&
    !!input.ctaButtonLabel &&
    Array.isArray(input.impactCounters) &&
    Array.isArray(input.processSteps) &&
    Array.isArray(input.strategyItems)
  );
}

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Failed to load site settings." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<SiteSettings>;

    if (!isValidSiteSettings(body)) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const updated = await updateSiteSettings(body);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update site settings." },
      { status: 400 },
    );
  }
}
