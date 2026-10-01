export interface Wisp {
  id: string;
  name: string;
  iconUrl: string;
  description: string;
  cost?: number;
  tier?: number;
  origin?: string;
}
