import { ComponentMeta, ComponentStory } from '@storybook/react';
import NewFileDialog, { INewFileDialog } from './NewFileDialog';
import { mockNewFileDialogProps } from './NewFileDialog.mocks';

export default {
  title: 'editors/NewFileDialog',
  component: NewFileDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof NewFileDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NewFileDialog> = (args) => (
  <NewFileDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockNewFileDialogProps.base,
} as INewFileDialog;
