import { ComponentMeta, ComponentStory } from '@storybook/react';
import ClassroomCardSkeleton, {
  IClassroomCardSkeleton,
} from './ClassroomCardSkeleton';
import { mockClassroomCardSkeletonProps } from './ClassroomCardSkeleton.mocks';

export default {
  title: 'cards/ClassroomCardSkeleton',
  component: ClassroomCardSkeleton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ClassroomCardSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ClassroomCardSkeleton> = (args) => (
  <ClassroomCardSkeleton {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockClassroomCardSkeletonProps.base,
} as IClassroomCardSkeleton;
