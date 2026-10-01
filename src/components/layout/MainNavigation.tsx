"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

export interface NavItemDef {
  name: string;
  href: string;
}

export const MAIN_NAV_ITEMS: NavItemDef[] = [
  { name: "Team Comp", href: "/team-comps" },
  { name: "Builder", href: "/builder" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Champion", href: "/champions" },
  { name: "Origins / Classes", href: "/traits" },
  { name: "Item", href: "/items" },
  { name: "Augment", href: "/augments" },
  { name: "Wisps", href: "/wisps" },
  { name: "Pet", href: "/pet" },
  { name: "Report Bug", href: "/report-bug" },
];

export function MainNavigation() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-[#101623] border-b border-[#1c2638]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none h-10">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative whitespace-nowrap px-3.5 py-2 text-[13px] font-medium transition-colors select-none",
                  isActive
                    ? "text-amber-400 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-[#161f31]"
                )}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400 rounded-t" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
