<script setup lang="ts">
import * as Tone from "tone";
// import { ref } from 'vue';

const octaves = [4, 5, 6];
const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const synth = new Tone.PolySynth(Tone.Synth).toDestination();

const isBlackKey = (key: string) => {
  return key.endsWith("#");
};

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
const playNote = (note: string, octave: number) => {
  synth.triggerAttackRelease(`${note}${octave}`, "8n");
};
</script>

<template>
  <div>
    <h1>Piano</h1>

    <div class="piano">
      <span class="octave" v-for="octave in octaves" v-bind:key="octave">
        <button
          :class="'key' + (isBlackKey(key) ? ' black' : '')"
          v-for="key in keys"
          v-bind:key="key"
          @click="playNote(key, octave)"
        >
          {{ key }}
        </button>
      </span>
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: var(--color-text);
}

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
