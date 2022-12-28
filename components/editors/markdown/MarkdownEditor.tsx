import PreviewIcon from '@mui/icons-material/Preview';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton, Typography, useTheme } from '@mui/material';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import { atom, useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

const Preview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
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
          <Preview
            source={value}
            linkTarget="_blank"
            pluginsFilter={(type, plugin) => {
              if (type === 'rehype') {
                plugin.unshift([
                  rehypeSanitize,
                  {
                    ...defaultSchema,
                    attributes: {
                      ...defaultSchema.attributes,
                      code: [
                        ...(defaultSchema?.attributes?.code || []),
                        // List of all allowed languages:
                        [
                          'className',
                          'language-sh',
                          'language-bash',
                          'language-c',
                          'language-cpp',
                          'language-csharp',
                          'language-diff',
                          'language-go',
                          'language-java',
                          'language-javascript',
                          'language-js',
                          'language-jsx',
                          'language-json',
                          'language-python',
                          'language-py',
                          'language-rust',
                          'language-rs',
                          'language-sql',
                          'language-typescript',
                          'language-ts',
                          'language-tsx',
                          'language-xml',
                          'language-yaml',
                          'language-yml',
                        ],
                      ],
                    },
                  },
                ]);
              }
              return plugin;
            }}
          />
        </>
      )}
    </div>
  );
};

export default MarkdownEditor;
