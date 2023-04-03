<script setup lang="ts">
import { useKeys } from "@/utils/keys";

const octaves = [4, 5, 6];
const { keyboardLayout, isKeyActive, playKey, stopKey } = useKeys(octaves);

const getKeyClass = (note: string, octave: number) => ({
  key: true,
  black: !!note.endsWith("#"),
  active: isKeyActive(note, octave),
});
</script>

<template>
  <div class="piano">
    <span
      class="octave"
      v-for="octave in keyboardLayout"
      v-bind:key="octave[0].octave"
    >
      <button
        v-for="key in octave"
        v-bind:key="key.note + key.octave"
        :class="getKeyClass(key.note, key.octave)"
        :data-key="key.note + key.octave"
        @mousedown="playKey(key.note, key.octave)"
        @mouseup="stopKey(key.note, key.octave)"
      >
        {{ key.note }}
      </button>
    </span>

    <!-- TODO: Add a key that doesn't exist and fix the bug using the help of tests -->
    <!-- TODO: Throw an error if the dataset has a key that shouldn't have a sharp -->
    <!-- TODO: Use flats also, instead of only sharps, and update the tests -->
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
  transition: color 0.2s ease-in-out;
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

.key.active {
  color: transparent;
}
</style>
