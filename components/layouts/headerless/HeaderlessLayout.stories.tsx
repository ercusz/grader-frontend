import { ComponentMeta, ComponentStory } from '@storybook/react';
import HeaderlessLayout, { IHeaderlessLayout } from './HeaderlessLayout';
import { mockHeaderlessLayoutProps } from './HeaderlessLayout.mocks';

export default {
  title: 'layouts/HeaderlessLayout',
  component: HeaderlessLayout,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof HeaderlessLayout>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof HeaderlessLayout> = (args) => (
  <HeaderlessLayout {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockHeaderlessLayoutProps.base,
} as IHeaderlessLayout;
