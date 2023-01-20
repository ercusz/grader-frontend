import { ComponentMeta, ComponentStory } from '@storybook/react';
import EditAssignmentDialog, {
  IEditAssignmentDialog,
} from './EditAssignmentDialog';
import { mockEditAssignmentDialogProps } from './EditAssignmentDialog.mocks';

export default {
  title: 'templates/EditAssignmentDialog',
  component: EditAssignmentDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof EditAssignmentDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EditAssignmentDialog> = (args) => (
  <EditAssignmentDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockEditAssignmentDialogProps.base,
} as IEditAssignmentDialog;
