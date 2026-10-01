"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UtilityHeader } from "./UtilityHeader";
import { MainNavigation, MAIN_NAV_ITEMS } from "./MainNavigation";
import { PlayerSearch } from "@/components/player/PlayerSearch";
import { cn } from "@/utils/cn";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Row 1: Utility Header (Logo, Patch, Language, Login) */}
      <UtilityHeader
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Row 2: Main Navigation Bar (10 reference categories) */}
      <div className="hidden lg:block">
        <MainNavigation />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#20293a] bg-[#0c1017] px-4 pt-3 pb-6 space-y-4">
          <div className="mb-2">
            <PlayerSearch variant="compact" className="w-full" />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded text-xs font-medium transition-colors",
                    isActive
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "text-slate-300 hover:text-white hover:bg-[#151d2c]"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
