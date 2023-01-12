import { ComponentMeta, ComponentStory } from '@storybook/react';
import AssignmentContentCard, {
  IAssignmentContentCard,
} from './AssignmentContentCard';
import { mockAssignmentContentCardProps } from './AssignmentContentCard.mocks';

export default {
  title: 'templates/AssignmentContentCard',
  component: AssignmentContentCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AssignmentContentCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AssignmentContentCard> = (args) => (
  <AssignmentContentCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockAssignmentContentCardProps.base,
} as IAssignmentContentCard;
