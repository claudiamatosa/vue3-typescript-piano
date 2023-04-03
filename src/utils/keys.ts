import { ref } from "vue";
import { useSynthetiser } from "./tone";
import { notes } from "@/data/notes";

type Key = {
  note: string;
  octave: number;
};

type Keyboard = Key[][];

export const isBlackKey = (key: string) => {
  return key.endsWith("#");
};

export const createKeyboardLayout = (octaves: number[]): Keyboard => {
  const keyboard = [];

  for (const octave of octaves) {
    const keysForOctave = [];

    for (const note of notes) {
      keysForOctave.push({ note, octave });
    }

    keyboard.push(keysForOctave);
  }

  // Add the first note of the next octave at the end
  keyboard.push([{ note: notes[0], octave: octaves[octaves.length - 1] + 1 }]);

  return keyboard;
};

export const useKeys = (octaves: number[]) => {
  const activeKeys = ref<string[]>([]);
  const keyboardLayout = createKeyboardLayout(octaves);
  const synth = useSynthetiser();
  const { startNote, endNote } = synth;

  const isKeyActive = (note: string, octave: number) =>
    activeKeys.value.includes(note + octave);

  function playKey(note: string, octave: number) {
    const key = note + octave;

    if (!isKeyActive(note, octave)) {
      startNote(note, octave);
      activeKeys.value.push(key);
    }
  }

  function stopKey(note: string, octave: number) {
    const key = note + octave;

    if (isKeyActive(note, octave)) {
      endNote(note, octave);
      activeKeys.value = activeKeys.value.filter((k) => k !== key);
    }
  }

  return {
    keyboardLayout,
    isKeyActive,
    playKey,
    stopKey,
  };
};
