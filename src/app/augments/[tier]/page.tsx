import { notFound } from "next/navigation";
import { tftService } from "@/services/tft";
import { AugmentsTableView } from "@/features/augments/components/AugmentsTableView";
import {
  AugmentNumericTier,
  AUGMENT_NUMERIC_TIERS,
} from "@/features/augments/categories/augmentTierMapper";

export const dynamic = "force-static";

export function generateStaticParams() {
  return AUGMENT_NUMERIC_TIERS.map((t) => ({
    tier: t.id,
  }));
}

export default async function AugmentTierPage({
  params,
}: {
  params: Promise<{ tier: string }>;
}) {
  const { tier } = await params;

  const validTier = AUGMENT_NUMERIC_TIERS.find((t) => t.id === tier);
  if (!validTier) {
    notFound();
  }

  const augments = await tftService.getAugments();

  return (
    <AugmentsTableView
      initialAugments={augments}
      activeTier={tier as AugmentNumericTier}
    />
  );
}
