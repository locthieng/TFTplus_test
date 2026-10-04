export interface PlayerMatchUnit {
  championApiName: string;
  starLevel: number;
  itemApiNames: string[];
}

export interface PlayerMatchTrait {
  traitApiName: string;
  numUnits: number;
  style?: number;
}

export interface PlayerMatchSummary {
  matchId: string;
  gameDatetime: number;
  gameLengthSeconds: number;
  queueId?: number;
  placement: number;
  level: number;
  goldLeft: number;
  units: PlayerMatchUnit[];
  traits: PlayerMatchTrait[];
  augmentIds: string[];
}

export interface RawMatchDto {
  metadata: {
    data_version: string;
    match_id: string;
    participants: string[];
  };
  info: {
    game_datetime: number;
    game_length: number;
    game_version?: string;
    queue_id?: number;
    tft_set_number?: number;
    participants: Array<{
      puuid: string;
      placement: number;
      level: number;
      gold_left: number;
      last_round?: number;
      time_eliminated?: number;
      augments?: string[];
      traits?: Array<{
        name: string;
        num_units: number;
        style?: number;
        tier_current?: number;
        tier_total?: number;
      }>;
      units?: Array<{
        character_id: string;
        itemNames?: string[];
        name?: string;
        rarity?: number;
        tier?: number;
      }>;
    }>;
  };
}

export interface DetailedMatchUnit {
  characterId: string;
  starLevel: number;
  itemNames: string[];
  rarity?: number;
}

export interface DetailedMatchTrait {
  name: string;
  numUnits: number;
  style?: number;
  tierCurrent?: number;
  tierTotal?: number;
}

export interface DetailedMatchParticipant {
  puuid: string;
  accountResolved: boolean;
  gameName?: string;
  tagLine?: string;
  placement: number;
  level: number;
  goldLeft: number;
  lastRound?: number;
  timeEliminated?: number;
  augments: string[];
  traits: DetailedMatchTrait[];
  units: DetailedMatchUnit[];
}

export interface DetailedMatch {
  matchId: string;
  region: string;
  gameDatetime: number;
  gameLengthSeconds: number;
  queueId?: number;
  queueName: string;
  tftSetNumber?: number;
  gameVersion?: string;
  participants: DetailedMatchParticipant[];
}

export function getQueueName(queueId?: number): string {
  if (!queueId) return "Standard TFT";
  switch (queueId) {
    case 1100:
      return "Ranked TFT";
    case 1090:
      return "Normal TFT";
    case 1130:
      return "Hyper Roll";
    case 1160:
      return "Double Up";
    case 1170:
      return "Fortune's Favor";
    default:
      return `Queue ${queueId}`;
  }
}
