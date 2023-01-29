import { ComponentMeta, ComponentStory } from '@storybook/react';
import GraderStatusChip, { IGraderStatusChip } from './GraderStatusChip';
import { mockGraderStatusChipProps } from './GraderStatusChip.mocks';

export default {
  title: 'templates/GraderStatusChip',
  component: GraderStatusChip,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof GraderStatusChip>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GraderStatusChip> = (args) => (
  <GraderStatusChip {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockGraderStatusChipProps.base,
} as IGraderStatusChip;
