<script setup lang="ts">
import { baseKeys, isBlackKey, useSynthetiser } from "@/utils/tone";

const octaves = [4, 5, 6];
const keys = baseKeys;
const synth = useSynthetiser();
const { startNote, endNote } = synth;
</script>

<template>
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

    <!-- TODO: test ui with playwright -->
    <!-- TODO: Add a key that doesn't exist and fix the bug using the help of tests -->
    <!-- TODO: Throw an error if the dataset has a key that shouldn't have a sharp -->
    <!-- TODO: Use flats also, instead of only sharps, and update the tests -->
    <!-- TODO: A "unit" test that does not mock dependencies -->
    <!-- TODO: Integration tests with playright -->
    <!-- TODO: Refactor the code so the list of octaves is a prop instead of a fixed variable -->
    <!-- TODO: vitest UI: https://vitest.dev/guide/ui.html -->
    <!-- TODO: test runner (vitest) vs test libraries (vue-test-utils) -->
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
