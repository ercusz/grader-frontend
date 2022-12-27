import { ComponentMeta, ComponentStory } from '@storybook/react';
import CodeEditor, { ICodeEditor } from './CodeEditor';
import { mockCodeEditorProps } from './CodeEditor.mocks';

export default {
  title: 'editors/CodeEditor',
  component: CodeEditor,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CodeEditor>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CodeEditor> = (args) => (
  <CodeEditor {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCodeEditorProps.base,
} as ICodeEditor;
