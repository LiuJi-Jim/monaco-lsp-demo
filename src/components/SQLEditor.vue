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
  const { createSqlEditor } = await import('../monaco/editor');

  await performInit(true);

  const container = containerRef.value!;
  const content = `SELECT
  dept_name,
  COUNT(gender) AS gender_count,
  SUM(IF(gender = 'M', 1, 0)) AS male_count,
  SUM(IF(gender = 'F', 1, 0)) AS female_count,
  SUM(IF(gender = 'M', 1, 0)) / COUNT(gender) AS male_ratio,
  SUM(IF(gender = 'F', 1, 0)) / COUNT(gender) AS female_ratio
FROM
  employee
  JOIN dept_emp ON employee.emp_no = dept_emp.emp_no
  JOIN department ON dept_emp.dept_no = department.dept_no
GROUP BY
  dept_name`;
  const result = await createSqlEditor({
    htmlElement: container,
    content,
  });
  console.log('result', result);
  const url = createUrl('localhost', 30000, '/sampleServer');
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
