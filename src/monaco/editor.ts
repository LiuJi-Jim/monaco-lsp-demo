import { buildWorkerDefinition } from 'monaco-editor-workers';
import 'monaco-editor/esm/vs/editor/editor.all.js';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api.js';
// import 'monaco-editor/esm/vs/platform/accessibility/browser/accessibilityService.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js';

import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js';
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution.js';
import {
  createModelReference,
  createConfiguredEditor,
  IReference,
  ITextFileEditorModel,
} from 'vscode/monaco';
import { Uri } from 'vscode';

buildWorkerDefinition(
  new URL('@public/monaco-workers', import.meta.url).href,
  import.meta.url,
  true
);

export type ExampleJsonEditor = {
  languageId: string;
  editor: editor.IStandaloneCodeEditor;
  uri: Uri;
  modelRef: IReference<ITextFileEditorModel>;
};

export type ExampleSqlEditor = {
  languageId: string;
  editor: editor.IStandaloneCodeEditor;
  uri: Uri;
  modelRef: IReference<ITextFileEditorModel>;
};

export const createJsonEditor = async (config: {
  htmlElement: HTMLElement;
  content: string;
}) => {
  // create the model
  const uri = Uri.parse('/workspace/example.json');
  const modelRef = await createModelReference(uri, config.content);
  modelRef.object.setLanguageId('json');

  // create monaco editor
  const editor = createConfiguredEditor(config.htmlElement, {
    model: modelRef.object.textEditorModel,
    glyphMargin: true,
    lightbulb: {
      enabled: true,
    },
    automaticLayout: true,
    wordBasedSuggestions: false,
  });

  const result = {
    editor,
    uri,
    modelRef,
  } as ExampleJsonEditor;
  return Promise.resolve(result);
};

export const createSqlEditor = async (config: {
  htmlElement: HTMLElement;
  content: string;
}) => {
  // create the model
  const uri = Uri.parse('/workspace/employee.sql');
  const modelRef = await createModelReference(uri, config.content);
  modelRef.object.setLanguageId('sql');

  // create monaco editor
  const editor = createConfiguredEditor(config.htmlElement, {
    model: modelRef.object.textEditorModel,
    glyphMargin: true,
    lightbulb: {
      enabled: true,
    },
    automaticLayout: true,
    wordBasedSuggestions: false,
  });

  const result = {
    editor,
    uri,
    modelRef,
  } as ExampleSqlEditor;
  return Promise.resolve(result);
};
