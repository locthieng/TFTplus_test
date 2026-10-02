"use client";

import React from "react";

export function HomeHeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* High-fidelity procedural cosmic forest gradient mimicking Enchanted Wilds */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111728] via-[#0d1320] to-[#0a0e17]" />

      {/* Atmospheric radial glow orbs */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.15),rgba(139,92,246,0.08)_50%,transparent_75%)] blur-2xl" />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12),transparent_70%)] blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.12),transparent_70%)] blur-3xl" />

      {/* Hexagonal pattern subtle overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #f59e0b 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Vignette & bottom fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,transparent_40%,rgba(10,14,23,0.85)_100%)]" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/70 to-transparent" />
    </div>
  );
}
