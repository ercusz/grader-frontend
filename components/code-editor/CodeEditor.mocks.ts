import { Java } from '../../utils/languageTemplate';
import { ICodeEditor } from './CodeEditor';

const base: ICodeEditor = {
  language: Java.lang,
  template: Java.template,
  tabs: [{ path: 'Main.java', value: Java.template }],
  setTabs: undefined,
};

export const mockCodeEditorProps = {
  base,
};
