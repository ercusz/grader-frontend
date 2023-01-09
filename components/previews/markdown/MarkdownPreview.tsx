import { MarkdownPreviewProps } from '@uiw/react-markdown-preview';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const Preview = dynamic<MarkdownPreviewProps>(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

export interface IMarkdownPreview {
  content?: string;
}

const MarkdownPreview: React.FC<IMarkdownPreview> = ({ content }) => {
  return (
    <Preview
      source={content}
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
  );
};

export default MarkdownPreview;
