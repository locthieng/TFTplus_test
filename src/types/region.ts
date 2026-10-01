export type PlatformRegion = "vn" | "na" | "kr" | "euw";

export const SUPPORTED_REGIONS: { id: PlatformRegion; name: string; tagDefault: string }[] = [
  { id: "vn", name: "Vietnam (VN)", tagDefault: "VN2" },
  { id: "na", name: "North America (NA)", tagDefault: "NA1" },
  { id: "kr", name: "Korea (KR)", tagDefault: "KR1" },
  { id: "euw", name: "Europe West (EUW)", tagDefault: "EUW" },
];
