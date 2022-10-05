import { ComponentMeta, ComponentStory } from '@storybook/react';
import ClassroomLayout, { IClassroomLayout } from './ClassroomLayout';
import { mockClassroomLayoutProps } from './ClassroomLayout.mocks';

export default {
  title: 'layouts/ClassroomLayout',
  component: ClassroomLayout,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ClassroomLayout>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ClassroomLayout> = (args) => (
  <ClassroomLayout {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockClassroomLayoutProps.base,
} as IClassroomLayout;
