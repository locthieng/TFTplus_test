import { describe, it, expect } from "vitest";
import {
  cleanTftDescription,
  decodeBasicHtmlEntities,
  resolveCdragonImageUrl,
} from "./mapperUtils";

describe("mapperUtils", () => {
  describe("decodeBasicHtmlEntities", () => {
    it("decodes basic HTML entities correctly", () => {
      const input = "Gold&nbsp;&amp;&nbsp;Silver &lt;items&gt; &quot;quoted&#39;";
      expect(decodeBasicHtmlEntities(input)).toBe("Gold & Silver <items> \"quoted'");
    });
  });

  describe("cleanTftDescription", () => {
    it("strips HTML tags and breaks", () => {
      const input = "<rules>Combat start:</rules> Gain a shield.<br><br/>Next line.";
      expect(cleanTftDescription(input)).toBe("Combat start: Gain a shield. Next line.");
    });

    it("strips CommunityDragon variable tokens (@...Property...@)", () => {
      const input = "Gain @TFTUnitProperty.item:TFT_Augment_MagicRoll@ bonus stats.";
      expect(cleanTftDescription(input)).toBe("Gain bonus stats.");
    });

    it("strips icon tags (%i:...%)", () => {
      const input = "Gain 15 %i:scaleAD% Attack Damage.";
      expect(cleanTftDescription(input)).toBe("Gain 15 Attack Damage.");
    });

    it("removes empty parentheses and normalizes spaces and punctuation", () => {
      const input = "Gain 20% Attack Speed . () Deal extra damage ..";
      expect(cleanTftDescription(input)).toBe("Gain 20% Attack Speed. Deal extra damage.");
    });

    it("handles &nbsp; and extra whitespace", () => {
      const input = "First&nbsp;&nbsp;sentence.   Second    sentence.";
      expect(cleanTftDescription(input)).toBe("First sentence. Second sentence.");
    });

    it("returns empty string for null or empty input", () => {
      expect(cleanTftDescription(null)).toBe("");
      expect(cleanTftDescription("")).toBe("");
    });
  });

  describe("resolveCdragonImageUrl", () => {
    it("returns armory fallback if path is empty", () => {
      expect(resolveCdragonImageUrl(null)).toContain("tft_armory.png");
    });

    it("preserves absolute HTTP URLs", () => {
      const url = "https://example.com/icon.png";
      expect(resolveCdragonImageUrl(url)).toBe(url);
    });

    it("resolves relative game asset paths to cdragon raw URL", () => {
      const path = "ASSETS/Characters/TFT18_Ahri/HUD/TFT18_Ahri_Square.tex";
      const resolved = resolveCdragonImageUrl(path);
      expect(resolved).toBe("https://raw.communitydragon.org/latest/game/assets/characters/tft18_ahri/hud/tft18_ahri_square.png");
    });
  });
});
