import { ComponentMeta, ComponentStory } from '@storybook/react';
import CreateCommentForm, { ICreateCommentForm } from './CreateCommentForm';
import { mockCreateCommentFormProps } from './CreateCommentForm.mocks';

export default {
  title: 'templates/CreateCommentForm',
  component: CreateCommentForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CreateCommentForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CreateCommentForm> = (args) => (
  <CreateCommentForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCreateCommentFormProps.base,
} as ICreateCommentForm;
