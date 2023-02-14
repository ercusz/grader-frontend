import { ComponentMeta, ComponentStory } from '@storybook/react';
import FeedbackHeader, { IFeedbackHeader } from './FeedbackHeader';
import { mockFeedbackHeaderProps } from './FeedbackHeader.mocks';

export default {
  title: 'navigation/FeedbackHeader',
  component: FeedbackHeader,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof FeedbackHeader>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedbackHeader> = (args) => (
  <FeedbackHeader {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockFeedbackHeaderProps.base,
} as IFeedbackHeader;
