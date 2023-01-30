import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';

export interface IOutputBox {
  language: string;
  queryKey: string[];
  template?: string;
  onMount?: OnMount;
}

const OutputBox: React.FC<IOutputBox> = ({
  language,
  template,
  onMount,
  queryKey,
}) => {
  const theme = useTheme();
  const { data } = useQuery(queryKey, () => {}, { enabled: false });

  const getOutput = (program: any) => {
    if (!program) return;

    if (program.stderr != '') {
      return program.stderr;
    } else if (program.compile_output != '') {
      return program.compile_output;
    } else {
      return program.stdout;
    }
  };

  return (
    <Editor
      language={language}
      height="60vh"
      defaultValue={template}
      value={getOutput(data)}
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
        dropIntoEditor: {
          enabled: false,
        },
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
        wrappingIndent: 'none',
        guides: {
          bracketPairsHorizontal: false,
          highlightActiveBracketPair: false,
          indentation: false,
          highlightActiveIndentation: false,
        },
      }}
    />
  );
};

export default OutputBox;
