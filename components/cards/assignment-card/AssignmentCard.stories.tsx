import { ComponentMeta, ComponentStory } from '@storybook/react';
import AssignmentCard, { IAssignmentCard } from './AssignmentCard';
import { mockAssignmentCardProps } from './AssignmentCard.mocks';

export default {
  title: 'templates/AssignmentCard',
  component: AssignmentCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AssignmentCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AssignmentCard> = (args) => (
  <AssignmentCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockAssignmentCardProps.base,
} as IAssignmentCard;
