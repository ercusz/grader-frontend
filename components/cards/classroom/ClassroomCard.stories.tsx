import { ComponentMeta, ComponentStory } from '@storybook/react';
import ClassroomCard, { IClassroomCard } from './ClassroomCard';
import { mockClassroomCardProps } from './ClassroomCard.mocks';

export default {
  title: 'cards/ClassroomCard',
  component: ClassroomCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ClassroomCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ClassroomCard> = (args) => (
  <ClassroomCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockClassroomCardProps.base,
} as IClassroomCard;
