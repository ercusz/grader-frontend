import { ComponentMeta, ComponentStory } from '@storybook/react';
import SignUpForm, { ISignUpForm } from './SignUpForm';
import { mockSignUpFormProps } from './SignUpForm.mocks';

export default {
  title: 'templates/SignUpForm',
  component: SignUpForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SignUpForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SignUpForm> = (args) => (
  <SignUpForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSignUpFormProps.base,
} as ISignUpForm;
