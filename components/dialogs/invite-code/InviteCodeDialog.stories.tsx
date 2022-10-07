import { ComponentMeta, ComponentStory } from '@storybook/react';
import InviteCodeDialog, { IInviteCodeDialog } from './InviteCodeDialog';
import { mockInviteCodeDialogProps } from './InviteCodeDialog.mocks';

export default {
  title: 'templates/InviteCodeDialog',
  component: InviteCodeDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof InviteCodeDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof InviteCodeDialog> = (args) => (
  <InviteCodeDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockInviteCodeDialogProps.base,
} as IInviteCodeDialog;
