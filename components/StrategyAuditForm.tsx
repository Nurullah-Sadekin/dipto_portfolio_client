"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { SiteSettings } from "@/lib/siteSettings";
import { leadSchema, type LeadFormValues } from "@/lib/validation";

type StrategyAuditFormProps = {
  settings: SiteSettings;
};

export function StrategyAuditForm({ settings }: StrategyAuditFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  async function onSubmit(values: LeadFormValues) {
    setSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const payload = (await res.json()) as { error?: string };
        toast.error(payload.error ?? "Failed to send strategy audit request.");
        return;
      }

      reset();
      toast.success("Strategy audit request received.");
    } catch {
      toast.error("Failed to send strategy audit request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      id="strategy-audit"
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[32px] border border-[rgba(0,245,212,0.34)] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_0_0_1px_rgba(0,245,212,0.08),0_0_48px_rgba(0,245,212,0.08)] backdrop-blur"
    >
      <div className="mb-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00F5D4]">
          Strategy Audit
        </p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          {settings.ctaHeading}
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-[#b9c0cb] sm:text-base">
          {settings.ctaDescription}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white" htmlFor="lead-name">
            Full Name
          </label>
          <input
            id="lead-name"
            {...register("name")}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#00F5D4] focus:bg-white/8"
            placeholder="Your full name"
          />
          {errors.name && <p className="text-sm text-red-300">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white" htmlFor="lead-email">
            Work Email
          </label>
          <input
            id="lead-email"
            {...register("email")}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#00F5D4] focus:bg-white/8"
            placeholder="name@company.com"
          />
          {errors.email && <p className="text-sm text-red-300">{errors.email.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-white" htmlFor="lead-company">
            Company
          </label>
          <input
            id="lead-company"
            {...register("company")}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#00F5D4] focus:bg-white/8"
            placeholder="Organization or business unit"
          />
          {errors.company && (
            <p className="text-sm text-red-300">{errors.company.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-white" htmlFor="lead-message">
            Current Constraint
          </label>
          <textarea
            id="lead-message"
            rows={6}
            {...register("message")}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#00F5D4] focus:bg-white/8"
            placeholder="Share your current operating bottleneck, growth target, and decision context."
          />
          {errors.message && (
            <p className="text-sm text-red-300">{errors.message.message}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.28em] text-[#7d86a0]">
          Response window: 24 business hours
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[#00F5D4] px-6 py-3 text-sm font-semibold text-[#07131f] transition hover:bg-[#58f8df] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Submitting..." : settings.ctaButtonLabel}
        </button>
      </div>
    </form>
  );
}
