import { ComponentMeta, ComponentStory } from '@storybook/react';
import TopicCard, { ITopicCard } from './TopicCard';
import { mockTopicCardProps } from './TopicCard.mocks';

export default {
  title: 'templates/TopicCard',
  component: TopicCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TopicCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TopicCard> = (args) => (
  <TopicCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockTopicCardProps.base,
} as ITopicCard;
