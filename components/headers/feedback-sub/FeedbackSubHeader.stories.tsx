import { ComponentMeta, ComponentStory } from '@storybook/react';
import FeedbackSubHeader, { IFeedbackSubHeader } from './FeedbackSubHeader';
import { mockFeedbackSubHeaderProps } from './FeedbackSubHeader.mocks';

export default {
  title: 'templates/FeedbackSubHeader',
  component: FeedbackSubHeader,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof FeedbackSubHeader>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedbackSubHeader> = (args) => (
  <FeedbackSubHeader {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockFeedbackSubHeaderProps.base,
} as IFeedbackSubHeader;
