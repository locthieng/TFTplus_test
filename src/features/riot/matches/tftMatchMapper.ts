import { RawMatchDto, PlayerMatchSummary } from "./tftMatch.types";

export function mapRawMatchToPlayerSummary(
  dto: RawMatchDto,
  targetPuuid: string
): PlayerMatchSummary | null {
  const participant = dto.info?.participants?.find(
    (p) => p.puuid.toLowerCase() === targetPuuid.toLowerCase()
  );

  if (!participant) return null;

  const units = (participant.units || []).map((u) => ({
    championApiName: u.character_id,
    starLevel: u.tier || 1,
    itemApiNames: u.itemNames || [],
  }));

  const traits = (participant.traits || [])
    .filter((t) => (t.style ?? 0) > 0 || (t.tier_current ?? 0) > 0)
    .map((t) => ({
      traitApiName: t.name,
      numUnits: t.num_units,
      style: t.style,
    }));

  return {
    matchId: dto.metadata.match_id,
    gameDatetime: dto.info.game_datetime,
    gameLengthSeconds: Math.round(dto.info.game_length),
    queueId: dto.info.queue_id,
    placement: participant.placement,
    level: participant.level,
    goldLeft: participant.gold_left,
    units,
    traits,
    augmentIds: participant.augments || [],
  };
}
