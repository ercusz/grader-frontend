import { ComponentMeta, ComponentStory } from '@storybook/react';
import EditCourseInfoDialog, {
  IEditCourseInfoDialog,
} from './EditCourseInfoDialog';
import { mockEditCourseInfoDialogProps } from './EditCourseInfoDialog.mocks';

export default {
  title: 'templates/EditCourseInfoDialog',
  component: EditCourseInfoDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof EditCourseInfoDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EditCourseInfoDialog> = (args) => (
  <EditCourseInfoDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockEditCourseInfoDialogProps.base,
} as IEditCourseInfoDialog;
