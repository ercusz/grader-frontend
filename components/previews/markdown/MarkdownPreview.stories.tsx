import { ComponentMeta, ComponentStory } from '@storybook/react';
import MarkdownPreview, { IMarkdownPreview } from './MarkdownPreview';
import { mockMarkdownPreviewProps } from './MarkdownPreview.mocks';

export default {
  title: 'templates/MarkdownPreview',
  component: MarkdownPreview,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof MarkdownPreview>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MarkdownPreview> = (args) => (
  <MarkdownPreview {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockMarkdownPreviewProps.base,
} as IMarkdownPreview;
