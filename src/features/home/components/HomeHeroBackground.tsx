"use client";

import React from "react";
import Image from "next/image";

export function HomeHeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Real Set 18 key art with responsive crop (mobile: 60% center, desktop: center) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/tft/set18/hero.webp"
          alt="TFT Set 18 Enchanted Wilds Key Art"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center] md:object-center opacity-45 mix-blend-luminosity scale-105"
        />
      </div>

      {/* Dark overlay & cinematic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b101c]/80 via-[#0c1222]/90 to-[#0a0e17] z-10" />

      {/* Atmospheric radial glow orbs tuned for Enchanted Wilds */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.18),rgba(139,92,246,0.12)_50%,transparent_75%)] blur-2xl z-20" />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)] blur-3xl z-20" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_70%)] blur-3xl z-20" />

      {/* Hexagonal pattern subtle overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-screen z-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #f59e0b 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Vignette & bottom fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,transparent_30%,rgba(10,14,23,0.9)_100%)] z-20" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/80 to-transparent z-20" />
    </div>
  );
}
