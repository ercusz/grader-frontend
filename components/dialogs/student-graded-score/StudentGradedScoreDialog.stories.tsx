import { ComponentMeta, ComponentStory } from '@storybook/react';
import StudentGradedScoreDialog, {
  IStudentGradedScoreDialog,
} from './StudentGradedScoreDialog';
import { mockStudentGradedScoreDialogProps } from './StudentGradedScoreDialog.mocks';

export default {
  title: 'templates/StudentGradedScoreDialog',
  component: StudentGradedScoreDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof StudentGradedScoreDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof StudentGradedScoreDialog> = (args) => (
  <StudentGradedScoreDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockStudentGradedScoreDialogProps.base,
} as IStudentGradedScoreDialog;
