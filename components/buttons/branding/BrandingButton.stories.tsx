import { ComponentMeta, ComponentStory } from '@storybook/react';
import BrandingButton, { IBrandingButton } from './BrandingButton';
import { mockBrandingButtonProps } from './BrandingButton.mocks';

export default {
  title: 'navigation/BrandingButton',
  component: BrandingButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof BrandingButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BrandingButton> = (args) => (
  <BrandingButton {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockBrandingButtonProps.base,
} as IBrandingButton;
