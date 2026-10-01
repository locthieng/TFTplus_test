import { TftService } from "./TftService";
import { StaticTftRepository } from "@/features/tft-data/repositories/StaticTftRepository";
import { MockTeamCompRepository } from "@/features/team-comps/repositories/MockTeamCompRepository";

export function createTftService(): TftService {
  return new TftService(
    new StaticTftRepository(),
    new MockTeamCompRepository()
  );
}

export const tftService = createTftService();
