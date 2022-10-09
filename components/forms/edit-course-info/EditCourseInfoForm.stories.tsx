import { ComponentMeta, ComponentStory } from '@storybook/react';
import EditCourseInfoForm, { IEditCourseInfoForm } from './EditCourseInfoForm';
import { mockEditCourseInfoFormProps } from './EditCourseInfoForm.mocks';

export default {
  title: 'templates/EditCourseInfoForm',
  component: EditCourseInfoForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof EditCourseInfoForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EditCourseInfoForm> = (args) => (
  <EditCourseInfoForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockEditCourseInfoFormProps.base,
} as IEditCourseInfoForm;
