import { tftService } from "@/services/tft";
import { AugmentsTableView } from "@/features/augments/components/AugmentsTableView";

export const dynamic = "force-static";

export default async function AugmentsPage() {
  const augments = await tftService.getAugments();

  return <AugmentsTableView initialAugments={augments} activeTier="1" />;
}
