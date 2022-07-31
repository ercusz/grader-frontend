import Editor, { OnChange, OnMount } from '@monaco-editor/react';
import { useTheme } from '@mui/material/styles';

export interface ICodeEditor {
  language: string;
  template?: string;
  onChange?: OnChange;
  onMount?: OnMount;
}

const CodeEditor: React.FC<ICodeEditor> = ({ language, template, onChange, onMount }) => {
  const theme = useTheme();

  return (
    <Editor
      height="60vh"
      onChange={onChange}
      onMount={onMount}
      defaultValue={template}
      defaultLanguage={language}
      theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'github'}
      loading={'กำลังโหลด'}
      options={{
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: 'on',
        accessibilitySupport: 'auto',
        autoIndent: true,
        automaticLayout: true,
        codeLens: true,
        colorDecorators: true,
        contextmenu: true,
        cursorBlinking: 'blink',
        cursorSmoothCaretAnimation: false,
        cursorStyle: 'line',
        disableLayerHinting: false,
        disableMonospaceOptimizations: false,
        dragAndDrop: false,
        fixedOverflowWidgets: false,
        folding: true,
        foldingStrategy: 'auto',
        fontLigatures: false,
        formatOnPaste: false,
        formatOnType: false,
        hideCursorInOverviewRuler: false,
        highlightActiveIndentGuide: true,
        links: true,
        mouseWheelZoom: true,
        multiCursorMergeOverlapping: true,
        multiCursorModifier: 'alt',
        overviewRulerBorder: true,
        overviewRulerLanes: 2,
        quickSuggestions: true,
        quickSuggestionsDelay: 100,
        readOnly: false,
        renderControlCharacters: false,
        renderFinalNewline: true,
        renderIndentGuides: true,
        renderLineHighlight: 'all',
        renderWhitespace: 'none',
        revealHorizontalRightPadding: 30,
        roundedSelection: true,
        rulers: [],
        scrollBeyondLastColumn: 5,
        scrollBeyondLastLine: true,
        selectOnLineNumbers: true,
        selectionClipboard: true,
        selectionHighlight: true,
        showFoldingControls: 'mouseover',
        smoothScrolling: true,
        suggestOnTriggerCharacters: true,
        wordBasedSuggestions: true,
        wordSeparators: '~!@#$%^&*()-=+[{]}|;:\'",.<>/?',
        wordWrap: 'off',
        wordWrapBreakAfterCharacters: '\t})]?|&,;',
        wordWrapBreakBeforeCharacters: '{([+',
        wordWrapBreakObtrusiveCharacters: '.',
        wordWrapColumn: 80,
        wordWrapMinified: true,
        wrappingIndent: 'none',
      }}
    />
  );
};

export default CodeEditor;
