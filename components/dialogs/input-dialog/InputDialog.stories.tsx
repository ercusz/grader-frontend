import { ComponentMeta, ComponentStory } from '@storybook/react';
import InputDialog, { IInputDialog } from './InputDialog';
import { mockInputDialogProps } from './InputDialog.mocks';

export default {
  title: 'editors/InputDialog',
  component: InputDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof InputDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof InputDialog> = (args) => (
  <InputDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockInputDialogProps.base,
} as IInputDialog;
