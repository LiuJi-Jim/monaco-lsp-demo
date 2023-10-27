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
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js';
// import 'monaco-editor/esm/vs/language/typescript/monaco.contribution.js';
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

export type ExampleSqlEditor = {
  languageId: string;
  editor: editor.IStandaloneCodeEditor;
  uri: Uri;
  modelRef: IReference<ITextFileEditorModel>;
};

export const createExampleSqlContent = () => {
  return `SELECT
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
