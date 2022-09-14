import { ComponentMeta, ComponentStory } from '@storybook/react';
import UploadedStudentsDialog, {
  IUploadedStudentsDialog,
} from './UploadedStudentsDialog';
import { mockUploadedStudentsDialogProps } from './UploadedStudentsDialog.mocks';

export default {
  title: 'editors/UploadedStudentsDialog',
  component: UploadedStudentsDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof UploadedStudentsDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UploadedStudentsDialog> = (args) => (
  <UploadedStudentsDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockUploadedStudentsDialogProps.base,
} as IUploadedStudentsDialog;
