import { ComponentMeta, ComponentStory } from '@storybook/react';
import TopicContentCard, { ITopicContentCard } from './TopicContentCard';
import { mockTopicContentCardProps } from './TopicContentCard.mocks';

export default {
  title: 'templates/TopicContentCard',
  component: TopicContentCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TopicContentCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TopicContentCard> = (args) => (
  <TopicContentCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockTopicContentCardProps.base,
} as ITopicContentCard;
