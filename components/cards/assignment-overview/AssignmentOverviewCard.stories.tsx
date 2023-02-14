import { ComponentMeta, ComponentStory } from '@storybook/react';
import AssignmentOverviewCard, {
  IAssignmentOverviewCard,
} from './AssignmentOverviewCard';
import { mockAssignmentOverviewCardProps } from './AssignmentOverviewCard.mocks';

export default {
  title: 'templates/AssignmentOverviewCard',
  component: AssignmentOverviewCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AssignmentOverviewCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AssignmentOverviewCard> = (args) => (
  <AssignmentOverviewCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockAssignmentOverviewCardProps.base,
} as IAssignmentOverviewCard;
