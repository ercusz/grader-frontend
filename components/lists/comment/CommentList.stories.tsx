import { ComponentMeta, ComponentStory } from '@storybook/react';
import CommentList, { ICommentList } from './CommentList';
import { mockCommentListProps } from './CommentList.mocks';

export default {
  title: 'templates/CommentList',
  component: CommentList,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CommentList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommentList> = (args) => (
  <CommentList {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCommentListProps.base,
} as ICommentList;
