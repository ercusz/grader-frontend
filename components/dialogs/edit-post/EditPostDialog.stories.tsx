import { ComponentMeta, ComponentStory } from '@storybook/react';
import EditPostDialog, { IEditPostDialog } from './EditPostDialog';
import { mockEditPostDialogProps } from './EditPostDialog.mocks';

export default {
  title: 'templates/EditPostDialog',
  component: EditPostDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof EditPostDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EditPostDialog> = (args) => (
  <EditPostDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockEditPostDialogProps.base,
} as IEditPostDialog;
