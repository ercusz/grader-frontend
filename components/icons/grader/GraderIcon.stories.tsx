import { ComponentMeta, ComponentStory } from '@storybook/react';
import GraderIcon, { IGraderIcon } from './GraderIcon';
import { mockGraderIconProps } from './GraderIcon.mocks';

export default {
  title: 'templates/GraderIcon',
  component: GraderIcon,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof GraderIcon>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GraderIcon> = (args) => (
  <GraderIcon {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockGraderIconProps.base,
} as IGraderIcon;
