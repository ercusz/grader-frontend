import { ComponentMeta, ComponentStory } from '@storybook/react';
import SignInForm, { ISignInForm } from './SignInForm';
import { mockSignInFormProps } from './SignInForm.mocks';

export default {
  title: 'templates/SignInForm',
  component: SignInForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SignInForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SignInForm> = (args) => (
  <SignInForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSignInFormProps.base,
} as ISignInForm;
