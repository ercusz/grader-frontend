import { ComponentMeta, ComponentStory } from '@storybook/react';
import EditTopicDialog, { IEditTopicDialog } from './EditTopicDialog';
import { mockEditTopicDialogProps } from './EditTopicDialog.mocks';

export default {
  title: 'templates/EditTopicDialog',
  component: EditTopicDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof EditTopicDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EditTopicDialog> = (args) => (
  <EditTopicDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockEditTopicDialogProps.base,
} as IEditTopicDialog;
