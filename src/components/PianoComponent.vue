<script setup lang="ts">
import * as Tone from "tone";
// import { ref } from 'vue';

const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const synth = new Tone.Synth().toDestination();

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
const playNote = (note: string) => {
  synth.triggerAttackRelease(`${note}4`, "8n");
};
</script>

<template>
  <div>
    <h1>Piano</h1>
    <button v-for="key in keys" v-bind:key="key" @click="playNote(key)">{{ key }}</button>
  </div>
</template>

<style scoped>
h1 {
  color: var(--color-text);
}
</style>
