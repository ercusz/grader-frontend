import { ComponentMeta, ComponentStory } from '@storybook/react';
import { mockSideDrawerProps } from './SideDrawer.mocks';
import SideDrawer, { ISideDrawer } from './SideDrawer';

export default {
  title: 'templates/SideDrawer',
  component: SideDrawer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SideDrawer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SideDrawer> = (args) => (
  <SideDrawer {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSideDrawerProps.base,
} as ISideDrawer;
