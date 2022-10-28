import { ComponentMeta, ComponentStory } from '@storybook/react';
import AddTeacherAssistantDialog, {
  IAddTeacherAssistantDialog,
} from './AddTeacherAssistantDialog';
import { mockAddTeacherAssistantDialogProps } from './AddTeacherAssistantDialog.mocks';

export default {
  title: 'templates/AddTeacherAssistantDialog',
  component: AddTeacherAssistantDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AddTeacherAssistantDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddTeacherAssistantDialog> = (args) => (
  <AddTeacherAssistantDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockAddTeacherAssistantDialogProps.base,
} as IAddTeacherAssistantDialog;
