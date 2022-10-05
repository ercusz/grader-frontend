import { ComponentMeta, ComponentStory } from '@storybook/react';
import ClassroomTabs, { IClassroomTabs } from './ClassroomTabs';
import { mockClassroomTabsProps } from './ClassroomTabs.mocks';

export default {
  title: 'templates/ClassroomTabs',
  component: ClassroomTabs,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ClassroomTabs>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ClassroomTabs> = (args) => (
  <ClassroomTabs {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockClassroomTabsProps.base,
} as IClassroomTabs;
