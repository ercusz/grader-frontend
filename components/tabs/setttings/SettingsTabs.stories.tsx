import { ComponentMeta, ComponentStory } from '@storybook/react';
import SettingsTabs, { ISettingsTabs } from './SettingsTabs';
import { mockSettingsTabsProps } from './SettingsTabs.mocks';

export default {
  title: 'templates/SettingsTabs',
  component: SettingsTabs,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SettingsTabs>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SettingsTabs> = (args) => (
  <SettingsTabs {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSettingsTabsProps.base,
} as ISettingsTabs;
