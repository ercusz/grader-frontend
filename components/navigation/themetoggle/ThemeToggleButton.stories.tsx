import { ComponentMeta, ComponentStory } from '@storybook/react';
import ThemeToggleButton, { IThemeToggleButton } from './ThemeToggleButton';
import { mockThemeToggleButtonProps } from './ThemeToggleButton.mocks';

export default {
  title: 'navigation/ThemeToggleButton',
  component: ThemeToggleButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ThemeToggleButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ThemeToggleButton> = (args) => (
  <ThemeToggleButton {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockThemeToggleButtonProps.base,
} as IThemeToggleButton;
