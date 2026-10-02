export interface Wisp {
  id: string;
  name: string;
  description: string;
  cost?: number;
  tier?: number;
  iconUrl?: string;
  setId: string;
  patch: string;
  source: string;
  verified: boolean;
}
