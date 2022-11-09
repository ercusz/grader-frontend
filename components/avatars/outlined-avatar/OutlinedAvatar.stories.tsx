import { ComponentMeta, ComponentStory } from '@storybook/react';
import OutlinedAvatar, { IOutlinedAvatar } from './OutlinedAvatar';
import { mockOutlinedAvatarProps } from './OutlinedAvatar.mocks';

export default {
  title: 'templates/OutlinedAvatar',
  component: OutlinedAvatar,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof OutlinedAvatar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof OutlinedAvatar> = (args) => (
  <OutlinedAvatar {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockOutlinedAvatarProps.base,
} as IOutlinedAvatar;
