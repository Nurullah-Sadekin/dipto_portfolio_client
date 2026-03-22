import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

export const leadSchema = z.object({
  name: z.string().min(2, "Full name is required."),
  email: z.email("Enter a valid email address."),
  company: z.string().min(2, "Company is required."),
  message: z.string().min(10, "Please share a little more detail."),
});

export const projectSchema = z.object({
  slug: z.string().min(1, "Slug is required."),
  title: z.string().min(2, "Title is required."),
  description: z.string().min(12, "Description must be more descriptive."),
  impactMetric: z.string().min(3, "Impact metric is required."),
  categoryTagsText: z.string().min(2, "Add at least one category tag."),
  visible: z.boolean(),
});

export const impactCounterSchema = z.object({
  id: z.string().min(1, "ID is required."),
  label: z.string().min(1, "Label is required."),
  value: z.coerce.number().min(0, "Value must be 0 or greater."),
  suffix: z.string(),
});

export const processStepSchema = z.object({
  id: z.string().min(1, "ID is required."),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(5, "Description is required."),
});

export const strategyItemSchema = z.object({
  id: z.string().min(1, "ID is required."),
  name: z.string().min(1, "Name is required."),
  type: z.enum(["Methodology", "Tech Tool"]),
  description: z.string().min(5, "Description is required."),
});

export const siteSettingsSchema = z.object({
  metadataTitle: z.string().min(2, "Metadata title is required."),
  metadataDescription: z.string().min(10, "Metadata description is required."),
  brandName: z.string().min(2, "Brand name is required."),
  heroHeadline: z.string().min(10, "Hero headline is required."),
  heroDescription: z.string().min(20, "Hero description is required."),
  heroPrimaryCtaLabel: z.string().min(2, "Primary CTA label is required."),
  heroSecondaryCtaLabel: z.string().min(2, "Secondary CTA label is required."),
  heroPrimaryCtaHref: z.string().min(1, "Primary CTA link is required."),
  heroSecondaryCtaHref: z.string().min(1, "Secondary CTA link is required."),
  processHeading: z.string().min(2, "Process heading is required."),
  processSubheading: z.string().min(10, "Process subheading is required."),
  portfolioHeading: z.string().min(2, "Portfolio heading is required."),
  portfolioSubheading: z.string().min(10, "Portfolio subheading is required."),
  stackHeading: z.string().min(2, "Stack heading is required."),
  stackSubheading: z.string().min(10, "Stack subheading is required."),
  stackFilterLabels: z.object({
    all: z.string().min(1, "All filter label is required."),
    methodology: z.string().min(1, "Methodology filter label is required."),
    techTool: z.string().min(1, "Tech tool filter label is required."),
  }),
  ctaHeading: z.string().min(2, "CTA heading is required."),
  ctaDescription: z.string().min(10, "CTA description is required."),
  ctaButtonLabel: z.string().min(2, "CTA button label is required."),
  impactCounters: z.array(impactCounterSchema).min(1, "Add at least one impact counter."),
  processSteps: z.array(processStepSchema).length(4, "Use exactly four roadmap steps."),
  strategyItems: z.array(strategyItemSchema).min(1, "Add at least one strategy item."),
});

export type LoginFormValues = z.input<typeof loginSchema>;
export type LeadFormValues = z.input<typeof leadSchema>;
export type ProjectFormValues = z.input<typeof projectSchema>;
export type SiteSettingsFormValues = z.input<typeof siteSettingsSchema>;
