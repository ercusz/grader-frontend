import { ComponentMeta, ComponentStory } from '@storybook/react';
import AddStudentForm, { IAddStudentForm } from './AddStudentForm';
import { mockAddStudentFormProps } from './AddStudentForm.mocks';

export default {
  title: 'templates/AddStudentForm',
  component: AddStudentForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AddStudentForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddStudentForm> = (args) => (
  <AddStudentForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockAddStudentFormProps.base,
} as IAddStudentForm;
