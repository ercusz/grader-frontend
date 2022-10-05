import { ComponentMeta, ComponentStory } from '@storybook/react';
import ClassroomMenu, { IClassroomMenu } from './ClassroomMenu';
import { mockClassroomMenuProps } from './ClassroomMenu.mocks';

export default {
  title: 'templates/ClassroomMenu',
  component: ClassroomMenu,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ClassroomMenu>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ClassroomMenu> = (args) => (
  <ClassroomMenu {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockClassroomMenuProps.base,
} as IClassroomMenu;
