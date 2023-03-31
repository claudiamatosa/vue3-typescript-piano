import { expect, describe, test, afterEach, vi } from "vitest";
import { isBlackKey, useSynthetiser } from "./tone";

const polySynthMock = {
  triggerAttack: vi.fn(),
  triggerRelease: vi.fn(),
};

vi.mock("tone", () => {
  return {
    PolySynth: class PolySynth {
      constructor() {}
      toDestination() {
        return polySynthMock;
      }
    },
    Synth: class Synth {
      constructor() {}
    },
  };
});

describe("utils/tone", () => {
  afterEach(() => {
    polySynthMock.triggerAttack.mockClear();
    polySynthMock.triggerRelease.mockClear();
  });

  describe("isBlackKey", () => {
    test("returns true when a key ends with a sharp", () => {
      expect(isBlackKey("C#")).toBe(true);
      expect(isBlackKey("D#")).toBe(true);
      expect(isBlackKey("F#")).toBe(true);
      expect(isBlackKey("G#")).toBe(true);
      expect(isBlackKey("A#")).toBe(true);
    });

    test("returns false for keys that are not sharp", () => {
      expect(isBlackKey("C")).toBe(false);
      expect(isBlackKey("D")).toBe(false);
      expect(isBlackKey("E")).toBe(false);
      expect(isBlackKey("F")).toBe(false);
      expect(isBlackKey("G")).toBe(false);
      expect(isBlackKey("A")).toBe(false);
      expect(isBlackKey("B")).toBe(false);
    });
  });

  describe("useSynthetiser", () => {
    test("creates a syntethiser containing a startNote and an endNote function", () => {
      const synth = useSynthetiser();
      expect(synth).toHaveProperty("startNote");
      expect(synth).toHaveProperty("endNote");
    });

    describe("startNote", () => {
      test("triggers a note on the provided octave", () => {
        const synth = useSynthetiser();
        synth.startNote("C", "4");
        expect(polySynthMock.triggerAttack).toHaveBeenCalledWith("C4");
      });

      test("triggers a note on the provided octave and sharp", () => {
        const synth = useSynthetiser();
        synth.startNote("C#", "4");
        expect(polySynthMock.triggerAttack).toHaveBeenCalledWith("C#4");
      });
    });

    describe("endNote", () => {
      test("triggers the end of a note on the provided octave", () => {
        const synth = useSynthetiser();
        synth.endNote();
        expect(polySynthMock.triggerRelease).toHaveBeenCalled();
      });

      test("triggers the end of a note on the provided octave and sharp", () => {
        const synth = useSynthetiser();
        synth.endNote();
        expect(polySynthMock.triggerRelease).toHaveBeenCalled();
      });
    });
  });
});
