<script setup lang="ts">
import * as Tone from "tone";
// import { ref } from 'vue';

const octaves = [4, 5, 6];
const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const synth = new Tone.PolySynth(Tone.Synth).toDestination();

const isBlackKey = (key: string) => {
  return key.endsWith("#");
};

const startNote = (note: string, octave: number) => {
  synth.triggerAttack(`${note}${octave}`);
};

const endNote = (note: string, octave: number) => {
  synth.triggerRelease(`${note}${octave}`);
};
</script>

<template>
  <div>
    <div class="piano">
      <span class="octave" v-for="octave in octaves" v-bind:key="octave">
        <button
          :class="'key' + (isBlackKey(key) ? ' black' : '')"
          v-for="key in keys"
          v-bind:key="key"
          @mousedown="startNote(key, octave)"
          @mouseup="endNote(key, octave)"
        >
          {{ key }}
        </button>
      </span>

      <!-- Add the first note in a higher octave to the end, so the piano feels
           complete when played all the way through. -->
      <span class="octave">
        <button
          class="key"
          @mousedown="startNote(keys[0], octaves[octaves.length - 1] + 1)"
          @mouseup="endNote(keys[0], octaves[octaves.length - 1] + 1)"
        >
          {{ keys[0] }}
        </button>
      </span>
    </div>
  </div>
</template>

<style scoped>
.piano {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.octave {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.key {
  font-size: 1rem;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;
  width: 3em;
  height: 3em;
  border: 1px solid var(--color-border);
  border-radius: 0.25em;
  background-color: var(--color-background);
  color: var(--color-text);
  padding: 0.5em;
  font-weight: 600;
  text-align: center;
  height: 10em;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.key.black {
  background-color: var(--color-background-dark);
  color: white;
  background-color: black;
  transform: scale(0.8);
  height: 8em;
  top: -1.8em;
  left: -1.5em;
  margin-right: -3em;
  z-index: 2;
}
</style>
