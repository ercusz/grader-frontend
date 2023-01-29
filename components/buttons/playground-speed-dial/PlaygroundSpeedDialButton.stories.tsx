import { ComponentMeta, ComponentStory } from '@storybook/react';
import PlaygroundSpeedDialButton, {
  IPlaygroundSpeedDialButton,
} from './PlaygroundSpeedDialButton';
import { mockPlaygroundSpeedDialButtonProps } from './PlaygroundSpeedDialButton.mocks';

export default {
  title: 'templates/PlaygroundSpeedDialButton',
  component: PlaygroundSpeedDialButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PlaygroundSpeedDialButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PlaygroundSpeedDialButton> = (args) => (
  <PlaygroundSpeedDialButton {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockPlaygroundSpeedDialButtonProps.base,
} as IPlaygroundSpeedDialButton;
