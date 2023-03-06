import { ComponentMeta, ComponentStory } from '@storybook/react';
import CreateSubmissionDialog, {
  ICreateSubmissionDialog,
} from './CreateSubmissionDialog';
import { mockCreateSubmissionDialogProps } from './CreateSubmissionDialog.mocks';

export default {
  title: 'templates/CreateSubmissionDialog',
  component: CreateSubmissionDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CreateSubmissionDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CreateSubmissionDialog> = (args) => (
  <CreateSubmissionDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCreateSubmissionDialogProps.base,
} as ICreateSubmissionDialog;
