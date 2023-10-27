<script setup lang="ts">
import { ref } from 'vue';
import SQLEditor from './components/SQLEditor.vue';

const lang = ref<'SQL' | 'JSON'>('SQL');
</script>

<template>
  <div style="display: flex; justify-content: center; column-gap: 8px">
    <label>
      <input v-model="lang" type="radio" value="SQL" />
      <span>SQL</span>
    </label>
    <label>
      <input v-model="lang" type="radio" value="JSON" />
      <span>JSON</span>
    </label>
  </div>
  <SQLEditor v-if="lang === 'SQL'" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
