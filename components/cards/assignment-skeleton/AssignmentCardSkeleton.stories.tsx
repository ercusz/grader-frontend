import { ComponentMeta, ComponentStory } from '@storybook/react';
import AssignmentCardSkeleton, {
  IAssignmentCardSkeleton,
} from './AssignmentCardSkeleton';
import { mockAssignmentCardSkeletonProps } from './AssignmentCardSkeleton.mocks';

export default {
  title: 'templates/AssignmentCardSkeleton',
  component: AssignmentCardSkeleton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AssignmentCardSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AssignmentCardSkeleton> = (args) => (
  <AssignmentCardSkeleton {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockAssignmentCardSkeletonProps.base,
} as IAssignmentCardSkeleton;
