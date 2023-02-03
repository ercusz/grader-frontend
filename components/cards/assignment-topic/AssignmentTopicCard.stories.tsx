import { ComponentMeta, ComponentStory } from '@storybook/react';
import AssignmentTopicCard, {
  IAssignmentTopicCard,
} from './AssignmentTopicCard';
import { mockAssignmentTopicCardProps } from './AssignmentTopicCard.mocks';

export default {
  title: 'templates/AssignmentTopicCard',
  component: AssignmentTopicCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AssignmentTopicCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AssignmentTopicCard> = (args) => (
  <AssignmentTopicCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockAssignmentTopicCardProps.base,
} as IAssignmentTopicCard;
