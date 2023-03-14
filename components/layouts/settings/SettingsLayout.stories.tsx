import { ComponentMeta, ComponentStory } from '@storybook/react';
import SettingsLayout, { ISettingsLayout } from './SettingsLayout';
import { mockSettingsLayoutProps } from './SettingsLayout.mocks';

export default {
  title: 'layouts/SettingsLayout',
  component: SettingsLayout,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SettingsLayout>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SettingsLayout> = (args) => (
  <SettingsLayout {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSettingsLayoutProps.base,
} as ISettingsLayout;
