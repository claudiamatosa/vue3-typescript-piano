import { expect, describe, test, afterEach, vi } from "vitest";
import { useSynthetiser } from "./tone";

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

  describe("useSynthetiser", () => {
    test("creates a syntethiser containing a startNote and an endNote function", () => {
      const synth = useSynthetiser();
      expect(synth).toHaveProperty("startNote");
      expect(synth).toHaveProperty("endNote");
    });

    describe("startNote", () => {
      test("triggers a note on the provided octave", () => {
        const synth = useSynthetiser();
        synth.startNote("C", 4);
        expect(polySynthMock.triggerAttack).toHaveBeenCalledWith("C4");
      });

      test("triggers a note on the provided octave and sharp", () => {
        const synth = useSynthetiser();
        synth.startNote("C#", 4);
        expect(polySynthMock.triggerAttack).toHaveBeenCalledWith("C#4");
      });
    });

    describe("endNote", () => {
      test("triggers the end of a note on the provided octave", () => {
        const synth = useSynthetiser();
        synth.endNote("D", 5);
        expect(polySynthMock.triggerRelease).toHaveBeenCalledWith("D5");
      });

      test("triggers the end of a note on the provided octave and sharp", () => {
        const synth = useSynthetiser();
        synth.endNote("D#", 5);
        expect(polySynthMock.triggerRelease).toHaveBeenCalledWith("D#5");
      });
    });
  });
});
