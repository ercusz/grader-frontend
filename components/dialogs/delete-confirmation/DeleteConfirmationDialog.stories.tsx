import { ComponentMeta, ComponentStory } from '@storybook/react';
import DeleteConfirmationDialog, {
  IDeleteConfirmationDialog,
} from './DeleteConfirmationDialog';
import { mockDeleteConfirmationDialogProps } from './DeleteConfirmationDialog.mocks';

export default {
  title: 'templates/DeleteConfirmationDialog',
  component: DeleteConfirmationDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof DeleteConfirmationDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DeleteConfirmationDialog> = (args) => (
  <DeleteConfirmationDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockDeleteConfirmationDialogProps.base,
} as IDeleteConfirmationDialog;
