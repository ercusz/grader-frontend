import { ComponentMeta, ComponentStory } from '@storybook/react';
import FeedbackLayout, { IFeedbackLayout } from './FeedbackLayout';
import { mockFeedbackLayoutProps } from './FeedbackLayout.mocks';

export default {
  title: 'layouts/FeedbackLayout',
  component: FeedbackLayout,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof FeedbackLayout>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedbackLayout> = (args) => (
  <FeedbackLayout {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockFeedbackLayoutProps.base,
} as IFeedbackLayout;
