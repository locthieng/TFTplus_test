import { TeamCompRepository, TeamCompFilters } from "./TeamCompRepository";
import { TeamComp, TeamCompTier } from "@/types/tft";
import { MOCK_TEAM_COMPS } from "../data/mockTeamComps";
import { SET18_TEAM_COMPS } from "../data/set18TeamComps";

const ALL_COMPS = [...SET18_TEAM_COMPS, ...MOCK_TEAM_COMPS];

export class MockTeamCompRepository implements TeamCompRepository {
  async getTeamComps(filters?: TeamCompFilters): Promise<TeamComp[]> {
    let result = [...ALL_COMPS];

    if (filters?.tier) {
      result = result.filter((c) => c.tier === filters.tier);
    }

    if (filters?.patch) {
      result = result.filter((c) => c.patch === filters.patch);
    }

    if (filters?.setId) {
      result = result.filter((c) => c.setId === filters.setId);
    }

    if (filters?.trait) {
      result = result.filter((c) =>
        c.traits.some((t) => t.traitId === filters.trait)
      );
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.champions.some((champ) =>
            champ.name.toLowerCase().includes(searchLower)
          )
      );
    }

    const tierOrder: Record<TeamCompTier, number> = { S: 1, A: 2, B: 3, C: 4 };
    return result.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);
  }

  async getTeamCompById(id: string): Promise<TeamComp | null> {
    const comp = ALL_COMPS.find((c) => c.id === id);
    return comp || null;
  }
}
