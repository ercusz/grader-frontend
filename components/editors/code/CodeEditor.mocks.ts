import { Java } from '@/constants/languageTemplate';
import { ICodeEditor } from './CodeEditor';

const base: ICodeEditor = {
  language: Java.lang,
  template: Java.template,
};

export const mockCodeEditorProps = {
  base,
};
