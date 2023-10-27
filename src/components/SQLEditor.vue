<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { editor as Editor } from 'monaco-editor';

const containerRef = ref<HTMLDivElement>();
const editorRef = ref<Editor.IStandaloneCodeEditor>();

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
  const url = createUrl('localhost', 23333, '/helloServer');
  createWebSocketAndStartClient(url);
});

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor) {
    editor.dispose();
  }
});
</script>

<template>
  <div
    ref="containerRef"
    style="width: 800px; height: 600px; text-align: initial"
  ></div>
</template>
