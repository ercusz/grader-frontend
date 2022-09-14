import { ComponentMeta, ComponentStory } from '@storybook/react';
import CreateCourseForm, { ICreateCourseForm } from './CreateCourseForm';
import { mockCreateCourseFormProps } from './CreateCourseForm.mocks';

export default {
  title: 'templates/CreateCourseForm',
  component: CreateCourseForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CreateCourseForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CreateCourseForm> = (args) => (
  <CreateCourseForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCreateCourseFormProps.base,
} as ICreateCourseForm;
