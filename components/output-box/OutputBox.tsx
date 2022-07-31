import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from '@mui/material/styles';

export interface IOutputBox {
  language: string;
  template?: string;
  onMount?: OnMount;
}

const OutputBox: React.FC<IOutputBox> = ({ language, template, onMount }) => {
  const theme = useTheme();

  return (
    <Editor
      language={language}
      height="60vh"
      defaultValue={template}
      onMount={onMount}
      theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'github'}
      loading={'กำลังโหลด'}
      options={{
        readOnly: true,
        lineNumbers: 'off',
        folding: false,
        lineDecorationsWidth: 30,
        lineNumbersMinChars: 0,
        overviewRulerBorder: false,
        contextmenu: false,
        renderLineHighlight: 'none',
        cursorStyle: 'underline-thin',
        enableDropIntoEditor: false,
        minimap: {
          enabled: false,
        },
        hideCursorInOverviewRuler: true,
        smoothScrolling: true,
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 5,
          horizontalScrollbarSize: 5,
        },
        wordWrap: 'on',
        wordWrapColumn: 80,
        wordWrapMinified: true,
        wrappingIndent: 'none',
        renderIndentGuides: false,
      }}
    />
  );
};

export default OutputBox;
