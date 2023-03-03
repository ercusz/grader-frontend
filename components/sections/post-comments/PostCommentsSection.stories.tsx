import { ComponentMeta, ComponentStory } from '@storybook/react';
import PostCommentsSection, {
  IPostCommentsSection,
} from './PostCommentsSection';
import { mockPostCommentsSectionProps } from './PostCommentsSection.mocks';

export default {
  title: 'templates/PostCommentsSection',
  component: PostCommentsSection,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PostCommentsSection>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PostCommentsSection> = (args) => (
  <PostCommentsSection {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockPostCommentsSectionProps.base,
} as IPostCommentsSection;
