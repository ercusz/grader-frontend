import { ComponentMeta, ComponentStory } from '@storybook/react';
import CreateAssignmentDialog, {
  ICreateAssignmentDialog,
} from './CreateAssignmentDialog';
import { mockCreateAssignmentDialogProps } from './CreateAssignmentDialog.mocks';

export default {
  title: 'templates/CreateAssignmentDialog',
  component: CreateAssignmentDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CreateAssignmentDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CreateAssignmentDialog> = (args) => (
  <CreateAssignmentDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCreateAssignmentDialogProps.base,
} as ICreateAssignmentDialog;
