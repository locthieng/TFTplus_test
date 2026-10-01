"use client";

import React, { useState } from "react";
import { Bug, Check, Copy, Mail } from "lucide-react";

export default function ReportBugPage() {
  const [category, setCategory] = useState("data");
  const [pageUrl, setPageUrl] = useState("/");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [contact, setContact] = useState("");
  const [copied, setCopied] = useState(false);

  const formatReportText = () => {
    return `[TFTPlus Bug Report]
Category: ${category}
Page: ${pageUrl}
Timestamp: ${new Date().toISOString()}
Description:
${description}

Steps to Reproduce:
${steps}

Contact: ${contact || "N/A"}`;
  };

  const handleCopyReport = () => {
    const text = formatReportText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const mailtoHref = `mailto:support@tftplus.gg?subject=${encodeURIComponent(
    `[Bug Report] ${category.toUpperCase()} on ${pageUrl}`
  )}&body=${encodeURIComponent(formatReportText())}`;

  return (
    <div className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-[#20293b] pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Bug className="w-5 h-5 text-amber-400" />
          Report an Issue or Bug
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Found incorrect champion stats, a broken recipe, or unexpected builder behavior? Help us improve TFTPlus!
        </p>
      </div>

      <div className="bg-[#101624] border border-[#1e2a3f] rounded-lg p-5 space-y-4 shadow-sm text-xs">
        {/* Category */}
        <div className="space-y-1">
          <label className="font-bold text-slate-300 block">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-[#151f33] border border-[#24344d] rounded text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="data">Data Inaccuracy (Champion/Trait/Item stat)</option>
            <option value="builder">Team Builder / Hex Board Issue</option>
            <option value="ui">UI / Layout / Responsive Display Glitch</option>
            <option value="translation">Translation / Description Issue</option>
            <option value="other">Other Feedback</option>
          </select>
        </div>

        {/* Affected Page */}
        <div className="space-y-1">
          <label className="font-bold text-slate-300 block">Affected Page URL</label>
          <input
            type="text"
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            placeholder="e.g. /builder or /champions/da_18_aphelios"
            className="w-full px-3 py-2 bg-[#151f33] border border-[#24344d] rounded text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="font-bold text-slate-300 block">Description of the Issue</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What happened and what did you expect to happen?"
            className="w-full px-3 py-2 bg-[#151f33] border border-[#24344d] rounded text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
          />
        </div>

        {/* Steps */}
        <div className="space-y-1">
          <label className="font-bold text-slate-300 block">Steps to Reproduce (Optional)</label>
          <textarea
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            rows={2}
            placeholder="1. Go to /builder&#10;2. Drag unit X&#10;3. Observed behavior"
            className="w-full px-3 py-2 bg-[#151f33] border border-[#24344d] rounded text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
          />
        </div>

        {/* Contact */}
        <div className="space-y-1">
          <label className="font-bold text-slate-300 block">Discord or Email (Optional)</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="To follow up if needed"
            className="w-full px-3 py-2 bg-[#151f33] border border-[#24344d] rounded text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-[#1a2335]">
          <button
            type="button"
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#151f33] hover:bg-[#1a263d] text-slate-200 rounded border border-[#24344d] font-bold transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Report</span>
              </>
            )}
          </button>

          <a
            href={mailtoHref}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send via Email</span>
          </a>
        </div>
      </div>
    </div>
  );
}
