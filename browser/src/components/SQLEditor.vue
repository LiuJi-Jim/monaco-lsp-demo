<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import type { editor as Editor } from 'monaco-editor';
import { MonacoLanguageClient } from 'monaco-languageclient';
import ExecuteCommand from './ExecuteCommand.vue';

const containerRef = ref<HTMLDivElement>();
const editorRef = ref<Editor.IStandaloneCodeEditor>();
const webSocketRef = ref<WebSocket>();
const languageClientRef = shallowRef<MonacoLanguageClient>();

onMounted(async () => {
  console.log('mounted');
  const { createExampleSqlContent, createSqlEditor } = await import(
    '../monaco/editor'
  );
  const { initialize: initializeMonaco } = await import('../monaco/initialize');
  const { webSocket, languageClient } = await initializeMonaco();
  webSocketRef.value = webSocket;
  languageClientRef.value = languageClient;

  const container = containerRef.value!;
  const content = createExampleSqlContent();
  const result = await createSqlEditor({
    htmlElement: container,
    content,
  });
  console.log('result', result);
});

onBeforeUnmount(() => {
  editorRef.value?.dispose();
});
</script>

<template>
  <div class="w-full flex">
    <div ref="containerRef" style="width: 800px; height: 600px"></div>

    <div class="flex-1 flex flex-col gap-y-4 p-2">
      <ExecuteCommand
        v-if="languageClientRef"
        :language-client="languageClientRef"
      />
    </div>
  </div>
</template>
