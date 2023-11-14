import { MonacoLanguageClient } from 'monaco-languageclient';
import { shallowRef } from 'vue';

export type LSPServices = {
  webSocket: WebSocket;
  languageClient: MonacoLanguageClient;
};

let initialized = shallowRef<Promise<LSPServices>>();

const runner = async (): Promise<LSPServices> => {
  const { performInit } = await import('./services');
  const { createUrl, createWebSocketAndStartClient } = await import('./client');

  await performInit(true);

  // const url = createUrl('localhost', 23333, '/helloServer');
  const url = createUrl('localhost', 8080, '/lsp');

  const { webSocket, languageClient } = createWebSocketAndStartClient(url);
  return {
    webSocket,
    languageClient: await languageClient,
  };
};

export const initialize = async () => {
  if (!initialized.value) {
    initialized.value = runner();
  }

  return initialized.value!;
};
