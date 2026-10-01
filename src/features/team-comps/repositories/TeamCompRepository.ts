import { TeamComp, TeamCompTier } from "@/types/tft";

export interface TeamCompFilters {
  tier?: TeamCompTier;
  patch?: string;
  search?: string;
  trait?: string;
  setId?: string;
}

export interface TeamCompRepository {
  getTeamComps(filters?: TeamCompFilters): Promise<TeamComp[]>;
  getTeamCompById(id: string): Promise<TeamComp | null>;
}
