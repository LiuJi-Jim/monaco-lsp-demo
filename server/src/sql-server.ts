/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as URI from 'vscode-uri';
import 'vscode-ws-jsonrpc';
import {
  createConnection,
  _Connection,
  TextDocuments,
  ProposedFeatures,
} from 'vscode-languageserver/lib/node/main.js';
import { CompletionItem, CompletionList } from 'vscode-languageserver-types';
import {
  TextDocumentPositionParams,
  TextDocumentSyncKind,
} from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';

export class SqlServer {
  protected workspaceRoot: URI.URI | undefined;

  protected readonly documents = new TextDocuments(TextDocument);

  protected readonly pendingValidationRequests = new Map<
    string,
    NodeJS.Timeout
  >();

  constructor(protected readonly connection: _Connection) {
    this.documents.listen(this.connection);

    this.connection.onInitialize((params) => {
      params.initializationOptions;
      if (params.rootPath) {
        this.workspaceRoot = URI.URI.file(params.rootPath);
      } else if (params.rootUri) {
        this.workspaceRoot = URI.URI.parse(params.rootUri);
      }
      this.connection.console.log('The server is initialized.');
      return {
        capabilities: {
          textDocumentSync: TextDocumentSyncKind.Incremental,
          completionProvider: {
            resolveProvider: true,
            triggerCharacters: ['.', ' '],
          },
        },
      };
    });
    this.connection.onCompletion((params) => this.completion(params));
    this.connection.onCompletionResolve((params) =>
      this.resolveCompletion(params)
    );
    this.connection.onExecuteCommand(async (params) => {
      return { echo: params };
    });
  }

  start() {
    this.connection.listen();
  }

  protected completion(
    params: TextDocumentPositionParams
  ): Thenable<CompletionList | null> {
    const document = this.documents.get(params.textDocument.uri);
    if (!document) {
      return Promise.resolve(null);
    }
    return Promise.resolve({
      isIncomplete: false,
      items: [
        {
          label: 'hello',
          detail: '<Column>',
          insertText: 'hello ya',
        },
      ],
    });
  }
  protected resolveCompletion(item: CompletionItem): Thenable<CompletionItem> {
    return Promise.resolve(item);
  }
}

const scriptExec = process.argv[2];
if (scriptExec === '--stdio') {
  const connection = createConnection(ProposedFeatures.all);
  const ls = new SqlServer(connection);
  ls.start();
}
