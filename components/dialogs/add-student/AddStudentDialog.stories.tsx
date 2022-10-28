import { ComponentMeta, ComponentStory } from '@storybook/react';
import AddStudentDialog, { IAddStudentDialog } from './AddStudentDialog';
import { mockAddStudentDialogProps } from './AddStudentDialog.mocks';

export default {
  title: 'templates/AddStudentDialog',
  component: AddStudentDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AddStudentDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddStudentDialog> = (args) => (
  <AddStudentDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockAddStudentDialogProps.base,
} as IAddStudentDialog;
