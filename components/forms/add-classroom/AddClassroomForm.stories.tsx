import { ComponentMeta, ComponentStory } from '@storybook/react';
import AddClassroomForm, { IAddClassroomForm } from './AddClassroomForm';
import { mockAddClassroomFormProps } from './AddClassroomForm.mocks';

export default {
  title: 'templates/AddClassroomForm',
  component: AddClassroomForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AddClassroomForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddClassroomForm> = (args) => (
  <AddClassroomForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockAddClassroomFormProps.base,
} as IAddClassroomForm;
