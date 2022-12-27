import { ComponentMeta, ComponentStory } from '@storybook/react';
import PostToForm, { IPostToForm } from './PostToForm';
import { mockPostToFormProps } from './PostToForm.mocks';

export default {
  title: 'templates/PostToForm',
  component: PostToForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PostToForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PostToForm> = (args) => (
  <PostToForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockPostToFormProps.base,
} as IPostToForm;
