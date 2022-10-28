import { ComponentMeta, ComponentStory } from '@storybook/react';
import InviteStudentDialog, {
  IInviteStudentDialog,
} from './InviteStudentDialog';
import { mockInviteStudentDialogProps } from './InviteStudentDialog.mocks';

export default {
  title: 'templates/InviteStudentDialog',
  component: InviteStudentDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof InviteStudentDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof InviteStudentDialog> = (args) => (
  <InviteStudentDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockInviteStudentDialogProps.base,
} as IInviteStudentDialog;
