"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ProjectItem } from "@/lib/projects";
import type { SiteSettings } from "@/lib/siteSettings";
import { StrategyAuditForm } from "@/components/StrategyAuditForm";

type PortfolioClientProps = {
  projects: ProjectItem[];
  settings: SiteSettings;
};

type StackFilter = "all" | "Methodology" | "Tech Tool";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 1100;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplayValue(Math.round(value * progress));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

export function PortfolioClient({ projects, settings }: PortfolioClientProps) {
  const [stackFilter, setStackFilter] = useState<StackFilter>("all");

  const filteredStackItems = useMemo(() => {
    if (stackFilter === "all") {
      return settings.strategyItems;
    }

    return settings.strategyItems.filter((item) => item.type === stackFilter);
  }, [settings.strategyItems, stackFilter]);

  return (
    <main className="min-h-screen bg-[#121212] text-[#f5f7fb]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[540px] bg-[radial-gradient(circle_at_top_left,rgba(123,44,191,0.35),transparent_36%),radial-gradient(circle_at_top_right,rgba(0,245,212,0.16),transparent_24%)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(18,18,18,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex w-[min(1200px,92%)] items-center justify-between py-4">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.32em] text-white">
            {settings.brandName}
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-[#bfc6d5] md:flex">
            <a href="#process">Process</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#stack">Stack</a>
            <a href="#strategy-audit">Audit</a>
          </nav>
          <a
            href="#strategy-audit"
            className="rounded-full border border-[#00F5D4]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#00F5D4]"
          >
            Audit
          </a>
        </div>
      </header>

      <section className="mx-auto grid w-[min(1200px,92%)] gap-10 pb-24 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.p
            variants={itemVariants}
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#00F5D4]"
          >
            Operations and Strategic Planner
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
          >
            {settings.heroHeadline}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-base leading-8 text-[#adb4c3] sm:text-lg"
          >
            {settings.heroDescription}
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <a
              href={settings.heroPrimaryCtaHref}
              className="rounded-full bg-[#00F5D4] px-6 py-3 text-sm font-semibold text-[#07131f] transition hover:bg-[#59fae1]"
            >
              {settings.heroPrimaryCtaLabel}
            </a>
            <a
              href={settings.heroSecondaryCtaHref}
              className="rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#7B2CBF] hover:bg-white/8"
            >
              {settings.heroSecondaryCtaLabel}
            </a>
          </motion.div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1] as const,
            delay: 0.18,
          }}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.38)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,245,212,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(123,44,191,0.18),transparent_38%)]" />
          <div className="relative space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7f8aa3]">
                Live Impact Counter
              </p>
              <span className="rounded-full border border-[#00F5D4]/20 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#00F5D4]">
                System Healthy
              </span>
            </div>
            <div className="grid gap-4">
              {settings.impactCounters.map((counter) => (
                <div
                  key={counter.id}
                  className="rounded-3xl border border-white/8 bg-[#1E1E1E]/80 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.26em] text-[#7d86a0]">
                    {counter.label}
                  </p>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-[#00F5D4]">
                    <AnimatedCounter value={counter.value} suffix={counter.suffix} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </section>

      <section id="process" className="mx-auto w-[min(1200px,92%)] py-20">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00F5D4]">
            {settings.processHeading}
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            {settings.processSubheading}
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#1E1E1E]/80 p-8">
          <svg
            className="absolute inset-x-8 top-14 hidden h-10 w-[calc(100%-4rem)] lg:block"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <path
              d="M2 5 H98"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.4"
              strokeDasharray="3 3"
              fill="none"
            />
          </svg>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 lg:grid-cols-4"
          >
            {settings.processSteps.map((step, index) => (
              <motion.article
                key={step.id}
                variants={itemVariants}
                className="relative rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#7B2CBF]/40 bg-[#7B2CBF]/15 text-sm font-semibold text-[#d9b8ff]">
                  0{index + 1}
                </div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#adb4c3]">
                  {step.description}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="portfolio" className="mx-auto w-[min(1200px,92%)] py-20">
        <div className="mb-10 max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00F5D4]">
            {settings.portfolioHeading}
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            {settings.portfolioSubheading}
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid auto-rows-[minmax(220px,auto)] gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {projects.map((project, index) => (
            <motion.article
              key={project.slug}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-[30px] border border-white/10 bg-[#1E1E1E] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#00F5D4]/35 ${
                index % 3 === 0 ? "xl:col-span-2" : ""
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(123,44,191,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(0,245,212,0.12),transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="relative flex h-full flex-col justify-between gap-10">
                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    {project.categoryTags.map((tag) => (
                      <span
                        key={`${project.slug}-${tag}`}
                        className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#9ea8bc]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                      {project.title}
                    </h3>
                    <p className="max-w-2xl text-sm leading-7 text-[#b5bccb]">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-4">
                  <span className="text-xs uppercase tracking-[0.28em] text-[#7d86a0]">
                    Case Study
                  </span>
                  <span className="translate-y-3 rounded-full border border-[#00F5D4]/30 bg-[#00F5D4]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#00F5D4] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {project.impactMetric}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="stack" className="mx-auto w-[min(1200px,92%)] py-20">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00F5D4]">
              {settings.stackHeading}
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              {settings.stackSubheading}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { value: "all" as const, label: settings.stackFilterLabels.all },
              {
                value: "Methodology" as const,
                label: settings.stackFilterLabels.methodology,
              },
              {
                value: "Tech Tool" as const,
                label: settings.stackFilterLabels.techTool,
              },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStackFilter(filter.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  stackFilter === filter.value
                    ? "bg-[#7B2CBF] text-white"
                    : "border border-white/10 bg-white/5 text-[#b8c0ce]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredStackItems.map((item) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              className="rounded-[28px] border border-white/10 bg-[#1E1E1E] p-6"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-[#c5cbda]">
                  {item.type}
                </span>
                <span className="text-sm font-semibold text-[#7B2CBF]">Stack</span>
              </div>
              <h3 className="text-xl font-semibold text-white">{item.name}</h3>
              <p className="mt-3 text-sm leading-7 text-[#adb4c3]">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <footer className="mx-auto w-[min(1200px,92%)] py-20">
        <StrategyAuditForm settings={settings} />
      </footer>
    </main>
  );
}
