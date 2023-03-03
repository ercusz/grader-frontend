import { ComponentMeta, ComponentStory } from '@storybook/react';
import PostContent, { IPostContent } from './PostContent';
import { mockPostContentProps } from './PostContent.mocks';

export default {
  title: 'templates/PostContent',
  component: PostContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PostContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PostContent> = (args) => (
  <PostContent {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockPostContentProps.base,
} as IPostContent;
