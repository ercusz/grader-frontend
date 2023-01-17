import { ComponentMeta, ComponentStory } from '@storybook/react';
import PostCardSkeleton, { IPostCardSkeleton } from './PostCardSkeleton';
import { mockPostCardSkeletonProps } from './PostCardSkeleton.mocks';

export default {
  title: 'templates/PostCardSkeleton',
  component: PostCardSkeleton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PostCardSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PostCardSkeleton> = (args) => (
  <PostCardSkeleton {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockPostCardSkeletonProps.base,
} as IPostCardSkeleton;
