import { ComponentMeta, ComponentStory } from '@storybook/react';
import JoinClassroomDialog, {
  IJoinClassroomDialog,
} from './JoinClassroomDialog';
import { mockJoinClassroomDialogProps } from './JoinClassroomDialog.mocks';

export default {
  title: 'templates/JoinClassroomDialog',
  component: JoinClassroomDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof JoinClassroomDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof JoinClassroomDialog> = (args) => (
  <JoinClassroomDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockJoinClassroomDialogProps.base,
} as IJoinClassroomDialog;
