import { ComponentMeta, ComponentStory } from '@storybook/react';
import PostCard, { IPostCard } from './PostCard';
import { mockPostCardProps } from './PostCard.mocks';

export default {
  title: 'templates/PostCard',
  component: PostCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PostCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PostCard> = (args) => (
  <PostCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockPostCardProps.base,
} as IPostCard;
