import { describe, it, expect } from "vitest";
import { RiotIdSchema, parseRiotId } from "./riotIdSchema";

describe("RiotIdSchema and parseRiotId", () => {
  it("validates valid Riot IDs including Vietnamese and Korean Unicode", () => {
    expect(RiotIdSchema.safeParse({ gameName: "Faker", tagLine: "KR1" }).success).toBe(true);

    const res1 = parseRiotId("Faker#KR1");
    expect(res1.success).toBe(true);
    expect(res1.data).toEqual({ gameName: "Faker", tagLine: "KR1" });

    const res2 = parseRiotId("Em Chè#DDT");
    expect(res2.success).toBe(true);
    expect(res2.data).toEqual({ gameName: "Em Chè", tagLine: "DDT" });

    const res3 = parseRiotId("ABC#VN2");
    expect(res3.success).toBe(true);
  });

  it("fails when gameName is shorter than 3 characters", () => {
    const res = parseRiotId("AB#VN2");
    expect(res.success).toBe(false);
  });

  it("fails when tagLine is shorter than 3 characters", () => {
    const res1 = parseRiotId("ABC#V");
    expect(res1.success).toBe(false);

    const res2 = parseRiotId("ABC#VN");
    expect(res2.success).toBe(false);
  });

  it("fails when tagLine exceeds 5 chars", () => {
    const res = parseRiotId("Faker#TOOLONG");
    expect(res.success).toBe(false);
  });

  it("fails when gameName exceeds 16 chars", () => {
    const res = parseRiotId("ThisNameIsWayTooLong1234#KR1");
    expect(res.success).toBe(false);
  });

  it("fails when multiple # symbols are provided", () => {
    const res = parseRiotId("Faker#KR#1");
    expect(res.success).toBe(false);
  });

  it("fails when no # tag is present", () => {
    const res = parseRiotId("Faker");
    expect(res.success).toBe(false);
    expect(res.error).toContain("Name#Tag");
  });
});
