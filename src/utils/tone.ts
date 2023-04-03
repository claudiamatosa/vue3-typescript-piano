import { PolySynth, Synth } from "tone";

export const useSynthetiser = () => {
  const synth = new PolySynth(Synth).toDestination();

  const startNote = (note: string, octave: number) => {
    synth.triggerAttack(`${note}${octave}`);
  };

  const endNote = (note: string, octave: number) => {
    synth.triggerRelease(`${note}${octave}`);
  };

  return { startNote, endNote };
};
