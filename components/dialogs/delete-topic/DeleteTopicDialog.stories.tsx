import { ComponentMeta, ComponentStory } from '@storybook/react';
import DeleteTopicDialog, { IDeleteTopicDialog } from './DeleteTopicDialog';
import { mockDeleteTopicDialogProps } from './DeleteTopicDialog.mocks';

export default {
  title: 'templates/DeleteTopicDialog',
  component: DeleteTopicDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof DeleteTopicDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DeleteTopicDialog> = (args) => (
  <DeleteTopicDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockDeleteTopicDialogProps.base,
} as IDeleteTopicDialog;
