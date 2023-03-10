import { ComponentMeta, ComponentStory } from '@storybook/react';
import EditMaterialDialog, { IEditMaterialDialog } from './EditMaterialDialog';
import { mockEditMaterialDialogProps } from './EditMaterialDialog.mocks';

export default {
  title: 'templates/EditMaterialDialog',
  component: EditMaterialDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof EditMaterialDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EditMaterialDialog> = (args) => (
  <EditMaterialDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockEditMaterialDialogProps.base,
} as IEditMaterialDialog;
