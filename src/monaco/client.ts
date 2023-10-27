import { MonacoLanguageClient } from 'monaco-languageclient';
import {
  CloseAction,
  ErrorAction,
  MessageTransports,
} from 'vscode-languageclient';
import {
  WebSocketMessageReader,
  WebSocketMessageWriter,
  toSocket,
} from 'vscode-ws-jsonrpc';

export const createLanguageClient = (
  transports: MessageTransports
): MonacoLanguageClient => {
  return new MonacoLanguageClient({
    name: 'Sample Language Client',
    clientOptions: {
      // use a language id as a document selector
      documentSelector: ['json'],
      // disable the default error handler
      errorHandler: {
        error: () => ({ action: ErrorAction.Continue }),
        closed: () => ({ action: CloseAction.DoNotRestart }),
      },
    },
    // create a language client connection from the JSON RPC connection on demand
    connectionProvider: {
      get: () => {
        return Promise.resolve(transports);
      },
    },
  });
};

export const createUrl = (
  hostname: string,
  port: number,
  path: string,
  searchParams: Record<string, any> = {},
  secure: boolean = location.protocol === 'https:'
): string => {
  const protocol = secure ? 'wss' : 'ws';
  const url = new URL(`${protocol}://${hostname}:${port}${path}`);

  for (let [key, value] of Object.entries(searchParams)) {
    if (value instanceof Array) {
      value = value.join(',');
    }
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
};

export const createWebSocketAndStartClient = (url: string): WebSocket => {
  const webSocket = new WebSocket(url);
  webSocket.onopen = () => {
    const socket = toSocket(webSocket);
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    const languageClient = createLanguageClient({
      reader,
      writer,
    });
    languageClient.start();
    reader.onClose(() => languageClient.stop());
  };
  return webSocket;
};
