export type ProjectItem = {
  slug: string;
  title: string;
  description: string;
  impactMetric: string;
  categoryTags: string[];
  visible: boolean;
};

export const projects: ProjectItem[] = [
  {
    slug: "regional-ops-audit",
    title: "Regional Ops Audit",
    description:
      "Rebuilt the operating model for a distributed service network by mapping bottlenecks, redefining handoffs, and introducing KPI-led governance.",
    impactMetric: "30% OPEX Reduction",
    categoryTags: ["Methodology", "Operations", "Audit"],
    visible: true,
  },
  {
    slug: "pmo-recovery-program",
    title: "PMO Recovery Program",
    description:
      "Stabilized a lagging transformation portfolio with milestone controls, risk escalation paths, and weekly decision cadences for leadership.",
    impactMetric: "92% On-Time Delivery",
    categoryTags: ["Strategy", "PMO", "Optimization"],
    visible: true,
  },
  {
    slug: "commercial-planning-stack",
    title: "Commercial Planning Stack",
    description:
      "Designed a scalable planning framework across sales, logistics, and finance to improve forecast confidence and execution accountability.",
    impactMetric: "18% Forecast Accuracy Gain",
    categoryTags: ["Planning", "Analytics", "Tech Tool"],
    visible: true,
  },
  {
    slug: "field-force-visibility",
    title: "Field Force Visibility",
    description:
      "Introduced live visibility dashboards and issue-routing rules for field operations, reducing reporting lag and management blind spots.",
    impactMetric: "4x Faster Reporting",
    categoryTags: ["Dashboarding", "Execution", "Tech Tool"],
    visible: true,
  },
  {
    slug: "vendor-governance-reset",
    title: "Vendor Governance Reset",
    description:
      "Standardized supplier scorecards, approvals, and service-level reviews to create more disciplined external delivery performance.",
    impactMetric: "27% SLA Improvement",
    categoryTags: ["Governance", "Procurement", "Methodology"],
    visible: true,
  },
  {
    slug: "continuous-improvement-engine",
    title: "Continuous Improvement Engine",
    description:
      "Built a lightweight optimization loop that connected frontline issues to root-cause reviews and executive action tracking.",
    impactMetric: "41 Initiatives Closed",
    categoryTags: ["Optimization", "Kaizen", "Leadership"],
    visible: false,
  },
];
