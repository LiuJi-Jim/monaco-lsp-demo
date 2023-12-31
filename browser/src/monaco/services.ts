import { languages } from 'monaco-editor';
import { initServices } from 'monaco-languageclient';

const state = {
  servicesInitialized: false,
};

export const performInit = async (vscodeApiInit: boolean) => {
  if (vscodeApiInit === true) {
    if (!state.servicesInitialized) {
      await initServices({
        enableThemeService: false,
        enableTextmateService: false,
        enableModelService: true,
        configureEditorOrViewsService: {},
        // enableKeybindingsService: true,
        enableLanguagesService: true,
        enableOutputService: true,
        enableAccessibilityService: true,
        debugLogging: false,
      });
      state.servicesInitialized = true;

      // register the SQL language with Monaco
      languages.register({
        id: 'sql',
        extensions: ['.sql'],
        aliases: ['SQL', 'sql'],
        mimetypes: ['application/x-sql'],
      });
    }
  }
};
