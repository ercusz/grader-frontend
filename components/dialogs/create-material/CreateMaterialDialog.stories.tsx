import { ComponentMeta, ComponentStory } from '@storybook/react';
import CreateMaterialDialog, {
  ICreateMaterialDialog,
} from './CreateMaterialDialog';
import { mockCreateMaterialDialogProps } from './CreateMaterialDialog.mocks';

export default {
  title: 'templates/CreateMaterialDialog',
  component: CreateMaterialDialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CreateMaterialDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CreateMaterialDialog> = (args) => (
  <CreateMaterialDialog {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCreateMaterialDialogProps.base,
} as ICreateMaterialDialog;
