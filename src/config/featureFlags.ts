export const FEATURE_FLAGS = {
  wisps: true,
  pets: true,
  hexCores: false,
  livePlayerData: process.env.RIOT_API_ENABLED === "true",
  liveLeaderboard: process.env.RIOT_API_ENABLED === "true",
  riotLogin: false,
};
