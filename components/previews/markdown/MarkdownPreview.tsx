import { MarkdownPreviewProps } from '@uiw/react-markdown-preview';
import '@uiw/react-markdown-preview/markdown.css';
import mermaid from 'mermaid';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkToc from 'remark-toc';

const Preview = dynamic<MarkdownPreviewProps>(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

export interface IMarkdownPreview {
  content?: string;
}

const randomId = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

const getCode = (arr = []): string =>
  arr
    .map((dt: any) => {
      if (typeof dt === 'string') {
        return dt;
      }
      if (dt.props && dt.props.children) {
        return getCode(dt.props.children);
      }
      return false;
    })
    .filter(Boolean)
    .join('');

const Code = ({ children = [], className }: any) => {
  const demoId = useRef(`demo-${randomId()}`);
  const code = getCode(children);
  const demo = useRef(null);
  useEffect(() => {
    if (demo.current) {
      try {
        mermaid.initialize({
          theme: 'forest',
        });

        const str = mermaid.render(
          demoId.current,
          code,
          () => null,
          demo.current
        );
        // @ts-ignore
        demo.current.innerHTML = str;
      } catch (error) {
        // @ts-ignore
        demo.current.innerHTML = error;
      }
    }
  }, [code, demo]);

  if (
    typeof code === 'string' &&
    typeof className === 'string' &&
    /^language-mermaid/.test(className.toLocaleLowerCase())
  ) {
    return (
      <code ref={demo}>
        <code id={demoId.current} style={{ display: 'none' }} />
      </code>
    );
  }
  return <code className={String(className)}>{children}</code>;
};

const MarkdownPreview: React.FC<IMarkdownPreview> = ({ content }) => {
  return (
    <Preview
      source={content}
      components={{ code: Code }}
      remarkPlugins={[remarkToc]}
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
                    'language-mermaid',
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
