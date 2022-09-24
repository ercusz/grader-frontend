import Editor, { OnMount } from '@monaco-editor/react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SyntheticEvent, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { SiJava } from 'react-icons/si';
import { useIdeTabs } from '../../state/grader/useIdeTabs';
import NewFileDialog from '../newfile-dialog/NewFileDialog';

export interface ICodeEditor {
  language: string;
  template?: string;
  onMount?: OnMount;
}

const CodeEditor: React.FC<ICodeEditor> = ({
  language,
  template,
  onMount,
}) => {
  const theme = useTheme();
  const { ideTabs, setIdeTabs, addIdeTab, removeIdeTab } = useIdeTabs();
  const [currentTabIdx, setCurrentTabIdx] = useState(0);
  const [openNewFileDialog, setOpenNewFileDialog] = useState(false);
  const newFileFormContext = useForm<{ filename: string }>({
    defaultValues: {
      filename: '',
    },
  });
  const { control } = newFileFormContext;
  const fileName = useWatch({ control, name: 'filename' });

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setCurrentTabIdx(newValue);
  };

  const handleNewFileButton = () => {
    setOpenNewFileDialog(true);
  };

  const onSubmitFileName = () => {
    let index = ideTabs.length;

    const newTab = {
      path: fileName + '.java',
      value: `public class ${fileName} {

}`,
    };

    addIdeTab(newTab);

    setOpenNewFileDialog(false);

    const { resetField } = newFileFormContext;

    resetField('filename');

    setCurrentTabIdx(index);
  };

  const removeTab = (index: number) => {
    removeIdeTab(index);
  };

  const handleCloseTab = (index: number) => {
    if (index <= 0) {
      setCurrentTabIdx(0);
    } else {
      setCurrentTabIdx(index - 1);
    }
    removeTab(index);
  };

  const onChange = (value: any, event: any) => {
    const updatedTabs = ideTabs.map((tab, idx) => {
      if (idx === currentTabIdx) {
        return { ...tab, value: value };
      }

      return tab;
    });
    setIdeTabs(updatedTabs);
  };

  return (
    <>
      <NewFileDialog
        open={openNewFileDialog}
        setOpen={setOpenNewFileDialog}
        formContext={newFileFormContext}
        onSubmit={onSubmitFileName}
      />
      <Stack direction="row">
        <Tabs
          value={currentTabIdx}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Code Editor Tabs"
        >
          {ideTabs.map((tab, index) => (
            <Tab
              component="div"
              key={tab.path}
              label={
                <Stack
                  className="text-left"
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  {language === 'java' && (
                    <IconButton size="small" aria-label="Java File">
                      <SiJava />
                    </IconButton>
                  )}
                  <Typography
                    variant="overline"
                    noWrap
                    sx={{ textTransform: 'none', mr: 1 }}
                  >
                    {tab.path}
                  </Typography>
                  {tab.path !== 'Main.java' && (
                    <IconButton
                      size="small"
                      aria-label="close this tab"
                      onClick={() => {
                        handleCloseTab(index);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              }
              sx={{
                maxWidth: '150px',
                display: 'block',
                px: 0.5,
              }}
            />
          ))}
        </Tabs>
        <IconButton
          component="div"
          size="small"
          aria-label="add new file"
          onClick={handleNewFileButton}
          sx={{
            '&.MuiButtonBase-root:hover': {
              bgcolor: 'transparent',
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Stack>
      <Editor
        height="50vh"
        onChange={onChange}
        onMount={onMount}
        defaultValue={ideTabs[currentTabIdx]?.value}
        defaultLanguage={language}
        path={ideTabs[currentTabIdx].path}
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
    </>
  );
};

export default CodeEditor;
