export type SiteNavItem = {
  label: string;
  href: string;
};

export type SiteStatItem = {
  value: string;
  label: string;
};

export type SiteLinkItem = {
  label: string;
  href: string;
};

export type SiteSectionContent = {
  eyebrow: string;
  title: string;
  description: string;
};

export type SiteContent = {
  metadataTitle: string;
  metadataDescription: string;
  brandMark: string;
  navLinks: SiteNavItem[];
  hero: {
    greeting: string;
    name: string;
    title: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  profile: {
    image: string;
    imageAlt: string;
    title: string;
    subtitle: string;
    location: string;
  };
  stats: SiteStatItem[];
  featuredWork: {
    eyebrow: string;
    title: string;
    buttonLabel: string;
    count: number;
  };
  skills: SiteSectionContent & {
    items: string[];
  };
  about: SiteSectionContent;
  contact: SiteSectionContent & {
    links: SiteLinkItem[];
  };
  inquiry: {
    eyebrow: string;
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    buttonLabel: string;
  };
  eventsPage: {
    eyebrow: string;
    title: string;
    description: string;
    backButtonLabel: string;
  };
  eventDetail: {
    eyebrow: string;
    locationLabel: string;
    clientLabel: string;
    attendeesLabel: string;
    experienceTitle: string;
    galleryTitle: string;
    feedbackTitle: string;
    backButtonLabel: string;
  };
};

export const defaultSiteContent: SiteContent = {
  metadataTitle: "Ruhullah Arefin | Strategic Planner",
  metadataDescription:
    "Strategic planner portfolio for event activation management and client servicing case studies.",
  brandMark: "RA.",
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#portfolio" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    greeting: "Hello, I'm",
    name: "Ruhullah Arefin",
    title: "Strategic Planner",
    description:
      "Strategic planner for event activation campaigns with deep client servicing experience. I design brand experiences that connect business goals with audience engagement.",
    primaryCtaLabel: "View My Work",
    primaryCtaHref: "#portfolio",
    secondaryCtaLabel: "Get In Touch",
    secondaryCtaHref: "#inquiry",
  },
  profile: {
    image: "https://picsum.photos/seed/ruhullah-profile/420/420",
    imageAlt: "Ruhullah Arefin",
    title: "Strategic Planner",
    subtitle: "Event Activation and Client Servicing",
    location: "Dhaka, Bangladesh",
  },
  stats: [
    { value: "45+", label: "Events Delivered" },
    { value: "80K+", label: "Audience Touchpoints" },
    { value: "18", label: "Cities Activated" },
  ],
  featuredWork: {
    eyebrow: "Featured Work",
    title: "Selected Event Activations",
    buttonLabel: "See All Events",
    count: 6,
  },
  skills: {
    eyebrow: "What I Do",
    title: "Strategic Planning with Reliable Client Servicing",
    description:
      "From ideation to on-ground execution, I coordinate teams, production, and stakeholder communication so campaigns run cleanly and deliver meaningful audience engagement.",
    items: [
      "Activation concept planning and rollout",
      "Vendor and timeline management",
      "Brand and client communication handling",
      "Audience engagement tracking and reporting",
    ],
  },
  about: {
    eyebrow: "About",
    title: "Planner Mindset with Execution Discipline",
    description:
      "I work as a strategic planner in event management, translating campaign goals into immersive live experiences while protecting timelines, budgets, and stakeholder confidence.",
  },
  contact: {
    eyebrow: "Social and Contact",
    title: "Let's Connect",
    description: "Reach out on your preferred channel for collaborations and project discussions.",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Email", href: "mailto:contact@example.com" },
      { label: "WhatsApp", href: "https://wa.me/8801000000000" },
    ],
  },
  inquiry: {
    eyebrow: "Contact Us",
    title: "Tell Me About Your Next Event",
    nameLabel: "Full Name",
    namePlaceholder: "Your full name",
    emailLabel: "Work Email",
    emailPlaceholder: "name@company.com",
    companyLabel: "Company",
    companyPlaceholder: "Brand or company",
    detailsLabel: "Project Query",
    detailsPlaceholder:
      "Share your event objective, expected audience size, and timeline.",
    buttonLabel: "Submit Inquiry",
  },
  eventsPage: {
    eyebrow: "All Events",
    title: "Portfolio of Activation Projects",
    description:
      "A growing portfolio of experiential campaigns, launch events, and high-engagement brand activations.",
    backButtonLabel: "Back to Home",
  },
  eventDetail: {
    eyebrow: "Case Study",
    locationLabel: "Event Location",
    clientLabel: "Client",
    attendeesLabel: "Attendee Count",
    experienceTitle: "Event Experience",
    galleryTitle: "Event Gallery",
    feedbackTitle: "Client Feedback",
    backButtonLabel: "Back to All Events",
  },
};
