import { ComponentMeta, ComponentStory } from '@storybook/react';
import MarkdownEditor, { IMarkdownEditor } from './MarkdownEditor';
import { mockMarkdownEditorProps } from './MarkdownEditor.mocks';

export default {
  title: 'templates/MarkdownEditor',
  component: MarkdownEditor,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof MarkdownEditor>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MarkdownEditor> = (args) => (
  <MarkdownEditor {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockMarkdownEditorProps.base,
} as IMarkdownEditor;
