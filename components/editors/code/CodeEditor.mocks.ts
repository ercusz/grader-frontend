import { Java } from '@/utils/languageTemplate';
import { ICodeEditor } from './CodeEditor';

const base: ICodeEditor = {
  language: Java.lang,
  template: Java.template,
};

export const mockCodeEditorProps = {
  base,
};
