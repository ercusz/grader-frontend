import { ComponentMeta, ComponentStory } from '@storybook/react';
import SubtaskCard, { ISubtaskCard } from './SubtaskCard';
import { mockSubtaskCardProps } from './SubtaskCard.mocks';

export default {
  title: 'templates/SubtaskCard',
  component: SubtaskCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SubtaskCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SubtaskCard> = (args) => (
  <SubtaskCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSubtaskCardProps.base,
} as ISubtaskCard;
