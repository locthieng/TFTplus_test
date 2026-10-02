export type VerificationStatus = "verified" | "curated" | "unverified";

export interface DataSourceMetadata {
  sourceName: string;
  sourceUrl?: string;
  setId?: string;
  patch?: string;
  generatedAt?: string;
  verifiedAt: string;
  verificationStatus: VerificationStatus;
  sourceNotes?: string;
}
