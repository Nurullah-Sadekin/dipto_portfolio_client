"use client";

import { useDeferredValue, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { LeadMessage } from "@/lib/leads";
import type { ProjectItem } from "@/lib/projects";
import type { SiteSettings } from "@/lib/siteSettings";
import {
  loginSchema,
  projectSchema,
  siteSettingsSchema,
  type LoginFormValues,
  type ProjectFormValues,
  type SiteSettingsFormValues,
} from "@/lib/validation";

type AdminPortalClientProps = {
  initialAuthenticated: boolean;
  initialLeads: LeadMessage[];
  initialProjects: ProjectItem[];
  initialSettings: SiteSettings;
};

const sidebarItems = [
  { href: "#dashboard-home", label: "Dashboard Home" },
  { href: "#project-manager", label: "Project Manager" },
  { href: "#lead-inbox", label: "Lead Inbox" },
  { href: "#site-settings", label: "Site Settings" },
];

function toProjectForm(project?: ProjectItem): ProjectFormValues {
  return {
    slug: project?.slug ?? "",
    title: project?.title ?? "",
    description: project?.description ?? "",
    impactMetric: project?.impactMetric ?? "",
    categoryTagsText: project?.categoryTags.join(", ") ?? "",
    visible: project?.visible ?? true,
  };
}

function toSiteSettingsForm(settings: SiteSettings): SiteSettingsFormValues {
  return {
    metadataTitle: settings.metadataTitle,
    metadataDescription: settings.metadataDescription,
    brandName: settings.brandName,
    heroHeadline: settings.heroHeadline,
    heroDescription: settings.heroDescription,
    heroPrimaryCtaLabel: settings.heroPrimaryCtaLabel,
    heroSecondaryCtaLabel: settings.heroSecondaryCtaLabel,
    heroPrimaryCtaHref: settings.heroPrimaryCtaHref,
    heroSecondaryCtaHref: settings.heroSecondaryCtaHref,
    processHeading: settings.processHeading,
    processSubheading: settings.processSubheading,
    portfolioHeading: settings.portfolioHeading,
    portfolioSubheading: settings.portfolioSubheading,
    stackHeading: settings.stackHeading,
    stackSubheading: settings.stackSubheading,
    stackFilterLabels: settings.stackFilterLabels,
    ctaHeading: settings.ctaHeading,
    ctaDescription: settings.ctaDescription,
    ctaButtonLabel: settings.ctaButtonLabel,
    impactCounters: settings.impactCounters,
    processSteps: settings.processSteps,
    strategyItems: settings.strategyItems,
  };
}

export function AdminPortalClient({
  initialAuthenticated,
  initialLeads,
  initialProjects,
  initialSettings,
}: AdminPortalClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [leads, setLeads] = useState<LeadMessage[]>(initialLeads);
  const [projectSearch, setProjectSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const deferredProjectSearch = useDeferredValue(projectSearch);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const projectForm = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: toProjectForm(),
  });

  const settingsForm = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: toSiteSettingsForm(initialSettings),
  });

  const counterFields = useFieldArray({
    control: settingsForm.control,
    name: "impactCounters",
  });

  const processFields = useFieldArray({
    control: settingsForm.control,
    name: "processSteps",
  });

  const strategyFields = useFieldArray({
    control: settingsForm.control,
    name: "strategyItems",
  });

  async function refreshProjects() {
    const res = await fetch("/api/projects?includeHidden=true");
    const payload = (await res.json()) as ProjectItem[];
    setProjects(Array.isArray(payload) ? payload : []);
  }

  async function refreshLeads() {
    const res = await fetch("/api/leads");
    const payload = (await res.json()) as LeadMessage[];
    setLeads(Array.isArray(payload) ? payload : []);
  }

  async function onLogin(values: LoginFormValues) {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = (await res.json()) as { error?: string };

    if (!res.ok) {
      loginForm.setError("password", {
        message: payload.error ?? "Username or password does not match.",
      });
      return;
    }

    setIsAuthenticated(true);
    loginForm.reset();
    toast.success("Admin session started.");
    await Promise.all([refreshProjects(), refreshLeads()]);
  }

  async function onLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    setIsAuthenticated(false);
    setEditingSlug(null);
    projectForm.reset(toProjectForm());
    toast.success("Admin session closed.");
  }

  async function onProjectSubmit(values: ProjectFormValues) {
    const payload = {
      slug: values.slug,
      title: values.title,
      description: values.description,
      impactMetric: values.impactMetric,
      categoryTags: values.categoryTagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      visible: values.visible,
    };

    const method = editingSlug ? "PUT" : "POST";
    const url = editingSlug ? `/api/projects/${editingSlug}` : "/api/projects";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responsePayload = (await res.json()) as { error?: string };

    if (!res.ok) {
      toast.error(responsePayload.error ?? "Failed to save project.");
      return;
    }

    await refreshProjects();
    setEditingSlug(null);
    projectForm.reset(toProjectForm());
    toast.success(editingSlug ? "Project updated." : "Project created.");
  }

  async function onDeleteProject(slug: string) {
    const res = await fetch(`/api/projects/${slug}`, {
      method: "DELETE",
    });

    const payload = (await res.json()) as { error?: string };

    if (!res.ok) {
      toast.error(payload.error ?? "Failed to delete project.");
      return;
    }

    await refreshProjects();
    if (editingSlug === slug) {
      setEditingSlug(null);
      projectForm.reset(toProjectForm());
    }
    toast.success("Project deleted.");
  }

  async function onToggleVisibility(project: ProjectItem) {
    const res = await fetch(`/api/projects/${project.slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        visible: !project.visible,
      }),
    });

    const payload = (await res.json()) as { error?: string };

    if (!res.ok) {
      toast.error(payload.error ?? "Failed to toggle project visibility.");
      return;
    }

    await refreshProjects();
    toast.success(`Project marked as ${project.visible ? "hidden" : "visible"}.`);
  }

  async function onSettingsSubmit(values: SiteSettingsFormValues) {
    const res = await fetch("/api/site-settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = (await res.json()) as { error?: string };

    if (!res.ok) {
      toast.error(payload.error ?? "Failed to update site settings.");
      return;
    }

    toast.success("Site settings saved.");
  }

  async function onUpdateLeadStatus(id: string, status: LeadMessage["status"]) {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const payload = (await res.json()) as { error?: string };

    if (!res.ok) {
      toast.error(payload.error ?? "Failed to update lead status.");
      return;
    }

    await refreshLeads();
    toast.success(`Lead marked as ${status}.`);
  }

  const columns: ColumnDef<ProjectItem>[] = [
    {
      accessorKey: "title",
      header: "Project",
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium text-white">{row.original.title}</p>
          <p className="max-w-md text-sm text-[#8d96a8]">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: "impactMetric",
      header: "KPI",
      cell: ({ row }) => (
        <span className="rounded-full border border-[#00F5D4]/20 bg-[#00F5D4]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#00F5D4]">
          {row.original.impactMetric}
        </span>
      ),
    },
    {
      id: "tags",
      header: "Category Tags",
      accessorFn: (row) => row.categoryTags.join(", "),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.categoryTags.map((tag) => (
            <span
              key={`${row.original.slug}-${tag}`}
              className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-[#aeb6c5]"
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "visible",
      header: "Visibility",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onToggleVisibility(row.original)}
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
            row.original.visible
              ? "bg-[#00F5D4]/10 text-[#00F5D4]"
              : "bg-white/8 text-[#8d96a8]"
          }`}
        >
          {row.original.visible ? "Visible" : "Hidden"}
        </button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingSlug(row.original.slug);
              projectForm.reset(toProjectForm(row.original));
            }}
            className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDeleteProject(row.original.slug)}
            className="rounded-full border border-red-400/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-300"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: projects,
    columns,
    state: {
      sorting,
      globalFilter: deferredProjectSearch,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue).toLowerCase();
      if (!query) {
        return true;
      }

      const haystack = [
        row.original.title,
        row.original.description,
        row.original.impactMetric,
        row.original.categoryTags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    },
  });

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#121212] px-6 py-10 text-[#f5f7fb]">
        <div className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-[#1E1E1E] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-8 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00F5D4]">
              System Status
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white">
              Disciplined Admin Portal
            </h1>
            <p className="text-sm leading-7 text-[#9ea7b9]">
              Authenticate to manage projects, update the global impact counters,
              review inbound leads, and control the public-facing portfolio.
            </p>
          </div>

          <form className="space-y-5" onSubmit={loginForm.handleSubmit(onLogin)}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="admin-username">
                Username
              </label>
              <input
                id="admin-username"
                {...loginForm.register("username")}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#00F5D4]"
              />
              {loginForm.formState.errors.username && (
                <p className="text-sm text-red-300">
                  {loginForm.formState.errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                {...loginForm.register("password")}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#00F5D4]"
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-300">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="rounded-full bg-[#00F5D4] px-6 py-3 text-sm font-semibold text-[#08131f]"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] text-[#f5f7fb]">
      <div className="mx-auto flex w-[min(1440px,100%)] flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-[#171717] p-6 lg:sticky lg:top-0 lg:h-screen lg:w-[280px] lg:border-b-0 lg:border-r">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00F5D4]">
              System Status
            </p>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-white">
              Admin Dashboard
            </h1>
          </div>

          <nav className="mt-10 space-y-2">
            {sidebarItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block rounded-2xl border border-transparent px-4 py-3 text-sm text-[#b5bdcd] transition hover:border-white/10 hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={onLogout}
            className="mt-10 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            Logout
          </button>
        </aside>

        <div className="flex-1 px-6 py-8 lg:px-10">
          <section
            id="dashboard-home"
            className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            {[
              {
                label: "Visible Projects",
                value: projects.filter((project) => project.visible).length,
              },
              { label: "Hidden Projects", value: projects.filter((project) => !project.visible).length },
              { label: "Pending Leads", value: leads.filter((lead) => lead.status === "pending").length },
              {
                label: "Impact Counters",
                value: settingsForm.watch("impactCounters").length,
              },
            ].map((stat) => (
              <article
                key={stat.label}
                className="rounded-[28px] border border-white/10 bg-[#1E1E1E] p-6"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-[#8b95a9]">
                  {stat.label}
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#00F5D4]">
                  {stat.value}
                </p>
              </article>
            ))}
          </section>

          <section
            id="project-manager"
            className="mb-10 rounded-[32px] border border-white/10 bg-[#1E1E1E] p-6"
          >
            <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00F5D4]">
                  Project Manager
                </p>
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
                  Searchable Portfolio Registry
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-[#99a2b5]">
                  Manage the case-study set that powers the public portfolio grid.
                </p>
              </div>

              <input
                value={projectSearch}
                onChange={(event) => setProjectSearch(event.target.value)}
                placeholder="Search by title, KPI, or tag"
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#00F5D4] xl:w-[360px]"
              />
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="overflow-hidden rounded-[24px] border border-white/10">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10 text-left">
                    <thead className="bg-white/5">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#95a0b4]"
                            >
                              {header.isPlaceholder ? null : (
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-2"
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                                </button>
                              )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="align-top">
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-4 text-sm text-[#d7dcea]">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#171717] p-5">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f8aa1]">
                      {editingSlug ? "Edit Project" : "Add New Project"}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {editingSlug ? "Update portfolio entry" : "Create a new portfolio entry"}
                    </h3>
                  </div>
                  {editingSlug && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSlug(null);
                        projectForm.reset(toProjectForm());
                      }}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <form
                  className="space-y-4"
                  onSubmit={projectForm.handleSubmit(onProjectSubmit)}
                >
                  <div className="space-y-2">
                    <label className="text-sm text-white" htmlFor="project-slug">
                      Slug
                    </label>
                    <input
                      id="project-slug"
                      {...projectForm.register("slug")}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                    />
                    {projectForm.formState.errors.slug && (
                      <p className="text-sm text-red-300">
                        {projectForm.formState.errors.slug.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white" htmlFor="project-title">
                      Title
                    </label>
                    <input
                      id="project-title"
                      {...projectForm.register("title")}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                    />
                    {projectForm.formState.errors.title && (
                      <p className="text-sm text-red-300">
                        {projectForm.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white" htmlFor="project-description">
                      Description
                    </label>
                    <textarea
                      id="project-description"
                      rows={5}
                      {...projectForm.register("description")}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                    />
                    {projectForm.formState.errors.description && (
                      <p className="text-sm text-red-300">
                        {projectForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white" htmlFor="project-kpi">
                      Impact Metric
                    </label>
                    <input
                      id="project-kpi"
                      {...projectForm.register("impactMetric")}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                    />
                    {projectForm.formState.errors.impactMetric && (
                      <p className="text-sm text-red-300">
                        {projectForm.formState.errors.impactMetric.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white" htmlFor="project-tags">
                      Category Tags
                    </label>
                    <input
                      id="project-tags"
                      {...projectForm.register("categoryTagsText")}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                      placeholder="Methodology, Optimization, Tech Tool"
                    />
                    {projectForm.formState.errors.categoryTagsText && (
                      <p className="text-sm text-red-300">
                        {projectForm.formState.errors.categoryTagsText.message}
                      </p>
                    )}
                  </div>

                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                    <input type="checkbox" {...projectForm.register("visible")} />
                    Visible on customer portfolio
                  </label>

                  <button
                    type="submit"
                    className="rounded-full bg-[#00F5D4] px-5 py-3 text-sm font-semibold text-[#08131f]"
                  >
                    {editingSlug ? "Save Project" : "Add Project"}
                  </button>
                </form>
              </div>
            </div>
          </section>

          <section
            id="lead-inbox"
            className="mb-10 rounded-[32px] border border-white/10 bg-[#1E1E1E] p-6"
          >
            <div className="mb-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00F5D4]">
                Lead Inbox
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
                Website Messages
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[#99a2b5]">
                Review incoming strategy-audit requests and update their operational
                status.
              </p>
            </div>

            <div className="grid gap-4">
              {leads.map((lead) => (
                <article
                  key={lead.id}
                  className="rounded-[24px] border border-white/10 bg-[#171717] p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-white">{lead.name}</h3>
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                            lead.status === "pending"
                              ? "bg-[#7B2CBF]/18 text-[#d7b7ff]"
                              : "bg-[#00F5D4]/12 text-[#00F5D4]"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#9ca5b8]">
                        {lead.email} · {lead.company}
                      </p>
                      <p className="text-sm leading-7 text-[#d5d9e3]">{lead.message}</p>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#7d87a0]">
                        {new Date(lead.createdAt).toLocaleString()}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateLeadStatus(lead.id, "pending")}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white"
                        >
                          Pending
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateLeadStatus(lead.id, "read")}
                          className="rounded-full border border-[#00F5D4]/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#00F5D4]"
                        >
                          Read
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {leads.length === 0 && (
                <div className="rounded-[24px] border border-dashed border-white/12 p-8 text-sm text-[#8e98ab]">
                  No leads have been submitted yet.
                </div>
              )}
            </div>
          </section>

          <section
            id="site-settings"
            className="rounded-[32px] border border-white/10 bg-[#1E1E1E] p-6"
          >
            <div className="mb-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00F5D4]">
                Site Settings
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
                Global Stats and Experience Settings
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[#99a2b5]">
                Manage the hero messaging, impact counters, roadmap copy, and stack
                taxonomy that power the public portfolio.
              </p>
            </div>

            <form
              className="space-y-8"
              onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-white" htmlFor="metadata-title">
                    Metadata Title
                  </label>
                  <input
                    id="metadata-title"
                    {...settingsForm.register("metadataTitle")}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white" htmlFor="brand-name">
                    Brand Name
                  </label>
                  <input
                    id="brand-name"
                    {...settingsForm.register("brandName")}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-white" htmlFor="metadata-description">
                    Metadata Description
                  </label>
                  <textarea
                    id="metadata-description"
                    rows={3}
                    {...settingsForm.register("metadataDescription")}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-white" htmlFor="hero-headline">
                    Hero Headline
                  </label>
                  <input
                    id="hero-headline"
                    {...settingsForm.register("heroHeadline")}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-white" htmlFor="hero-description">
                    Hero Description
                  </label>
                  <textarea
                    id="hero-description"
                    rows={4}
                    {...settingsForm.register("heroDescription")}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                  />
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#171717] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Global Stats Editor</h3>
                  <button
                    type="button"
                    onClick={() =>
                      counterFields.append({
                        id: `counter-${Date.now()}`,
                        label: "New Counter",
                        value: 0,
                        suffix: "",
                      })
                    }
                    className="rounded-full border border-[#00F5D4]/25 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#00F5D4]"
                  >
                    Add Counter
                  </button>
                </div>

                <div className="space-y-4">
                  {counterFields.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid gap-3 rounded-2xl border border-white/10 p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
                    >
                      <input
                        {...settingsForm.register(`impactCounters.${index}.label`)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                        placeholder="Label"
                      />
                      <input
                        type="number"
                        {...settingsForm.register(`impactCounters.${index}.value`, {
                          valueAsNumber: true,
                        })}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                        placeholder="Value"
                      />
                      <input
                        {...settingsForm.register(`impactCounters.${index}.suffix`)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                        placeholder="Suffix"
                      />
                      <button
                        type="button"
                        onClick={() => counterFields.remove(index)}
                        className="rounded-full border border-red-400/25 px-3 py-2 text-xs uppercase tracking-[0.18em] text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#171717] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Process Roadmap</h3>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7e88a0]">
                    Exactly four nodes
                  </p>
                </div>
                <div className="space-y-4">
                  {processFields.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid gap-3 rounded-2xl border border-white/10 p-4"
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          {...settingsForm.register(`processSteps.${index}.title`)}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                          placeholder="Step title"
                        />
                        <input
                          {...settingsForm.register(`processSteps.${index}.id`)}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                          placeholder="Step id"
                        />
                      </div>
                      <textarea
                        rows={3}
                        {...settingsForm.register(`processSteps.${index}.description`)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                        placeholder="Step description"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#171717] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Strategy Stack</h3>
                  <button
                    type="button"
                    onClick={() =>
                      strategyFields.append({
                        id: `stack-${Date.now()}`,
                        name: "",
                        type: "Methodology",
                        description: "",
                      })
                    }
                    className="rounded-full border border-[#7B2CBF]/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#d1b2ff]"
                  >
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {strategyFields.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid gap-3 rounded-2xl border border-white/10 p-4"
                    >
                      <div className="grid gap-3 md:grid-cols-3">
                        <input
                          {...settingsForm.register(`strategyItems.${index}.name`)}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                          placeholder="Item name"
                        />
                        <select
                          {...settingsForm.register(`strategyItems.${index}.type`)}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                        >
                          <option value="Methodology">Methodology</option>
                          <option value="Tech Tool">Tech Tool</option>
                        </select>
                        <div className="flex gap-3">
                          <input
                            {...settingsForm.register(`strategyItems.${index}.id`)}
                            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                            placeholder="Item id"
                          />
                          <button
                            type="button"
                            onClick={() => strategyFields.remove(index)}
                            className="rounded-full border border-red-400/25 px-3 py-2 text-xs uppercase tracking-[0.18em] text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={3}
                        {...settingsForm.register(`strategyItems.${index}.description`)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00F5D4]"
                        placeholder="Item description"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="rounded-full bg-[#00F5D4] px-6 py-3 text-sm font-semibold text-[#08131f]"
              >
                Save Site Settings
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
