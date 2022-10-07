import { ComponentMeta, ComponentStory } from '@storybook/react';
import UserMenu, { IUserMenu } from './UserMenu';
import { mockUserMenuProps } from './UserMenu.mocks';

export default {
  title: 'navigation/UserMenu',
  component: UserMenu,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof UserMenu>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserMenu> = (args) => (
  <UserMenu {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockUserMenuProps.base,
} as IUserMenu;
