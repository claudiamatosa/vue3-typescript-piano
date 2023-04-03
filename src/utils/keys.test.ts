import { describe, beforeEach, expect, test, vi, afterEach } from "vitest";
import * as tone from "@/utils/tone";

import { isBlackKey, createKeyboardLayout, useKeys } from "./keys";

const startNoteMock = vi.fn();
const endNoteMock = vi.fn();

describe("utils/keys", () => {
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

  describe("createKeyboardLayout", () => {
    test("returns a keyboard layout with the given number of octaves, and adds the first note as a highest octave to the end", () => {
      const keyboardLayout = createKeyboardLayout([2]);
      expect(keyboardLayout).toHaveLength(2);
      expect(keyboardLayout[0]).toHaveLength(12);
      expect(keyboardLayout[1]).toHaveLength(1);

      expect(keyboardLayout).toEqual([
        [
          { note: "C", octave: 2 },
          { note: "C#", octave: 2 },
          { note: "D", octave: 2 },
          { note: "D#", octave: 2 },
          { note: "E", octave: 2 },
          { note: "F", octave: 2 },
          { note: "F#", octave: 2 },
          { note: "G", octave: 2 },
          { note: "G#", octave: 2 },
          { note: "A", octave: 2 },
          { note: "A#", octave: 2 },
          { note: "B", octave: 2 },
        ],
        [{ note: "C", octave: 3 }],
      ]);
    });
  });

  describe("useKeys", () => {
    beforeEach(() => {
      vi.spyOn(tone, "useSynthetiser").mockImplementation(() => ({
        startNote: startNoteMock,
        endNote: endNoteMock,
      }));
    });

    afterEach(() => {
      startNoteMock.mockClear();
      endNoteMock.mockClear();
    });

    test("returns a keyboard layout with the given number of octaves", () => {
      const { keyboardLayout } = useKeys([5, 6]);
      expect(keyboardLayout).toHaveLength(3);
      expect(keyboardLayout[0][0]).toEqual({ note: "C", octave: 5 });
      expect(keyboardLayout[2][0]).toEqual({ note: "C", octave: 7 });
    });

    describe("isKeyActive", () => {
      test("returns true when the key is active", () => {
        const { isKeyActive, playKey } = useKeys([5, 6]);

        playKey("D", 5);
        expect(isKeyActive("D", 5)).toBe(true);
      });

      test("returns false when the key is not active", () => {
        const { isKeyActive, playKey } = useKeys([5, 6]);

        playKey("D", 5);
        expect(isKeyActive("C", 5)).toBe(false);
        expect(isKeyActive("D", 6)).toBe(false);
      });

      test("returns false when the key was played and then stopped", () => {
        const { isKeyActive, playKey, stopKey } = useKeys([5, 6]);

        playKey("D", 5);
        expect(isKeyActive("D", 5)).toBe(true);
        stopKey("D", 5);
        expect(isKeyActive("D", 5)).toBe(false);
      });
    });

    describe("playKey", () => {
      test("plays the note and adds it to the list of active keys", () => {
        const { playKey, isKeyActive } = useKeys([5, 6]);

        playKey("D", 5);
        expect(startNoteMock).toHaveBeenCalledWith("D", 5);
        expect(endNoteMock).not.toHaveBeenCalled();
        expect(isKeyActive("D", 5)).toBe(true);
      });

      test("doesn't play the note if it's already active", () => {
        const { playKey } = useKeys([5, 6]);

        playKey("D", 5);
        playKey("D", 5);
        expect(startNoteMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("stopKey", () => {
      test("stops the note and removes it from the list of active keys", () => {
        const { playKey, stopKey, isKeyActive } = useKeys([5, 6]);

        playKey("D", 5);
        stopKey("D", 5);
        expect(startNoteMock).toHaveBeenCalledTimes(1);
        expect(endNoteMock).toHaveBeenCalledWith("D", 5);
        expect(isKeyActive("D", 5)).toBe(false);
      });

      test("doesn't stop the note if it's not active", () => {
        const { stopKey } = useKeys([5, 6]);

        stopKey("D", 5);
        expect(endNoteMock).not.toHaveBeenCalled();
      });
    });
  });
});
