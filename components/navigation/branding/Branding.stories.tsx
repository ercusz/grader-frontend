import { ComponentMeta, ComponentStory } from '@storybook/react';
import Branding, { IBranding } from './Branding';
import { mockBrandingProps } from './Branding.mocks';

export default {
  title: 'navigation/Branding',
  component: Branding,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Branding>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Branding> = (args) => (
  <Branding {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockBrandingProps.base,
} as IBranding;
