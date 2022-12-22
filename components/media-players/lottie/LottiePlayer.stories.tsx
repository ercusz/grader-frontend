import { ComponentMeta, ComponentStory } from '@storybook/react';
import LottiePlayer, { ILottiePlayer } from './LottiePlayer';
import { mockLottiePlayerProps } from './LottiePlayer.mocks';

export default {
  title: 'templates/LottiePlayer',
  component: LottiePlayer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof LottiePlayer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LottiePlayer> = (args) => (
  <LottiePlayer {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockLottiePlayerProps.base,
} as ILottiePlayer;
