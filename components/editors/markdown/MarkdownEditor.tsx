import MarkdownPreview from '@/components/previews/markdown/MarkdownPreview';
import PreviewIcon from '@mui/icons-material/Preview';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton, Typography, useTheme } from '@mui/material';
import { MDEditorProps } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { atom, useAtom } from 'jotai';
import dynamic from 'next/dynamic';

const MDEditor = dynamic<MDEditorProps>(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export interface IMarkdownEditor {}

const previewAtom = atom(false);

const PreviewButton = () => {
  const [preview, setPreview] = useAtom(previewAtom);

  return (
    <IconButton onClick={() => setPreview(!preview)}>
      {preview ? <VisibilityOffIcon /> : <PreviewIcon />}
    </IconButton>
  );
};

const codePreview = {
  name: 'preview',
  keyCommand: 'preview',
  value: 'preview',
  icon: <PreviewButton />,
};

export const markdownEditorValueAtom = atom('');

const MarkdownEditor: React.FC<IMarkdownEditor> = () => {
  const theme = useTheme();
  const [value, setValue] = useAtom<string | undefined>(
    markdownEditorValueAtom
  );
  const [preview] = useAtom(previewAtom);

  return (
    <div data-color-mode={theme.palette.mode}>
      <MDEditor
        value={value}
        onChange={setValue}
        preview="edit"
        extraCommands={[codePreview]}
      />
      {preview && (
        <>
          <Typography variant="h6" component="h2" sx={{ paddingTop: 2 }}>
            Preview
          </Typography>
          <MarkdownPreview content={value} />
        </>
      )}
    </div>
  );
};

export default MarkdownEditor;
