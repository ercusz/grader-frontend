import { ComponentMeta, ComponentStory } from '@storybook/react';
import CreatePostCard, { ICreatePostCard } from './CreatePostCard';
import { mockCreatePostCardProps } from './CreatePostCard.mocks';

export default {
  title: 'templates/CreatePostCard',
  component: CreatePostCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CreatePostCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CreatePostCard> = (args) => (
  <CreatePostCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCreatePostCardProps.base,
} as ICreatePostCard;
