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
  const { performInit } = await import('../monaco/services');
  const { createUrl, createWebSocketAndStartClient } = await import(
    '../monaco/client'
  );
  const { createExampleSqlContent, createSqlEditor } = await import(
    '../monaco/editor'
  );

  await performInit(true);

  const container = containerRef.value!;
  const content = createExampleSqlContent();
  const result = await createSqlEditor({
    htmlElement: container,
    content,
  });
  console.log('result', result);
  // const url = createUrl('localhost', 23333, '/helloServer');
  const url = createUrl('localhost', 8080, '/lsp');

  const { webSocket, languageClient } = createWebSocketAndStartClient(url);
  webSocketRef.value = webSocket;
  languageClient.then((client) => {
    languageClientRef.value = client;
  });
});

onBeforeUnmount(() => {
  editorRef.value?.dispose();
  webSocketRef.value?.close();
  languageClientRef.value?.dispose();
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
