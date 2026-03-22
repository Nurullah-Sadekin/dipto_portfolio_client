import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import type { SiteContent } from "@/lib/siteContent";
import { getSiteContent, updateSiteContent } from "@/lib/siteContentStore";

function hasValidPairs(items: Array<{ label: string; href?: string; value?: string }>) {
  return items.every((item) => {
    if ("href" in item) {
      return !!item.label && !!item.href;
    }

    return !!item.label && !!item.value;
  });
}

function isValidSiteContent(input: Partial<SiteContent>): input is SiteContent {
  return (
    !!input.metadataTitle &&
    !!input.metadataDescription &&
    !!input.brandMark &&
    Array.isArray(input.navLinks) &&
    hasValidPairs(input.navLinks) &&
    !!input.hero?.greeting &&
    !!input.hero?.name &&
    !!input.hero?.title &&
    !!input.hero?.description &&
    !!input.hero?.primaryCtaLabel &&
    !!input.hero?.primaryCtaHref &&
    !!input.hero?.secondaryCtaLabel &&
    !!input.hero?.secondaryCtaHref &&
    !!input.profile?.image &&
    !!input.profile?.imageAlt &&
    !!input.profile?.title &&
    !!input.profile?.subtitle &&
    !!input.profile?.location &&
    Array.isArray(input.stats) &&
    hasValidPairs(input.stats) &&
    !!input.featuredWork?.eyebrow &&
    !!input.featuredWork?.title &&
    !!input.featuredWork?.buttonLabel &&
    typeof input.featuredWork?.count === "number" &&
    !!input.skills?.eyebrow &&
    !!input.skills?.title &&
    !!input.skills?.description &&
    Array.isArray(input.skills?.items) &&
    input.skills.items.every(Boolean) &&
    !!input.about?.eyebrow &&
    !!input.about?.title &&
    !!input.about?.description &&
    !!input.contact?.eyebrow &&
    !!input.contact?.title &&
    !!input.contact?.description &&
    Array.isArray(input.contact?.links) &&
    hasValidPairs(input.contact.links) &&
    !!input.inquiry?.eyebrow &&
    !!input.inquiry?.title &&
    !!input.inquiry?.nameLabel &&
    !!input.inquiry?.namePlaceholder &&
    !!input.inquiry?.emailLabel &&
    !!input.inquiry?.emailPlaceholder &&
    !!input.inquiry?.companyLabel &&
    !!input.inquiry?.companyPlaceholder &&
    !!input.inquiry?.detailsLabel &&
    !!input.inquiry?.detailsPlaceholder &&
    !!input.inquiry?.buttonLabel &&
    !!input.eventsPage?.eyebrow &&
    !!input.eventsPage?.title &&
    !!input.eventsPage?.description &&
    !!input.eventsPage?.backButtonLabel &&
    !!input.eventDetail?.eyebrow &&
    !!input.eventDetail?.locationLabel &&
    !!input.eventDetail?.clientLabel &&
    !!input.eventDetail?.attendeesLabel &&
    !!input.eventDetail?.experienceTitle &&
    !!input.eventDetail?.galleryTitle &&
    !!input.eventDetail?.feedbackTitle &&
    !!input.eventDetail?.backButtonLabel
  );
}

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json(
      { error: "Failed to load site content." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<SiteContent>;

    if (!isValidSiteContent(body)) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const updated = await updateSiteContent(body);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update site content." },
      { status: 400 },
    );
  }
}
