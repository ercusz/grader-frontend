import { ComponentMeta, ComponentStory } from '@storybook/react';
import OutputBox, { IOutputBox } from './OutputBox';
import { mockOutputBoxProps } from './OutputBox.mocks';

export default {
  title: 'editors/OutputBox',
  component: OutputBox,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof OutputBox>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof OutputBox> = (args) => (
  <OutputBox {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockOutputBoxProps.base,
} as IOutputBox;
