<script setup lang="ts">
import { MonacoLanguageClient } from 'monaco-languageclient';
import { ExecuteCommandParams } from 'vscode-languageclient';
import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';

const props = defineProps<{
  languageClient: MonacoLanguageClient;
}>();

const cmd = ref('setMetadata');
const params = useLocalStorage(
  'workspace/executeCommand.params',
  JSON.stringify(
    {
      instanceId: 'instances/instance-36d77ff4',
      databaseName: 'employee',
    },
    null,
    '  '
  )
);

const executeCommand = async () => {
  try {
    const executeCommandParams: ExecuteCommandParams = {
      command: cmd.value,
      arguments: [JSON.parse(params.value)],
    };
    const result = await props.languageClient.sendRequest(
      'workspace/executeCommand',
      executeCommandParams
    );
    alert('result: ' + String(result));
  } catch (err) {
    alert('error: ' + String(err));
  }
};
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div class="font-medium text-gray-500">workspace/executeCommand</div>
    <div
      class="grid items-start gap-x-2 gap-y-2 text-sm"
      style="grid-template-columns: auto 1fr"
    >
      <label class="font-medium text-gray-500 leading-[30px]">command</label>
      <input v-model="cmd" type="text" class="rounded border p-1 font-mono" />

      <label class="font-medium text-gray-500 leading-[30px]">params</label>
      <textarea
        v-model="params"
        rows="5"
        class="rounded border p-1 font-mono text-xs"
      />

      <div class="col-span-2">
        <button
          class="border hover:border-emerald-600 px-2 py-1 rounded text-base font-medium"
          @click="executeCommand"
        >
          executeCommand
        </button>
      </div>
    </div>
  </div>
</template>
