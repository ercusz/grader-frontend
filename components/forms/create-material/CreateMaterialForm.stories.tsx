import { ComponentMeta, ComponentStory } from '@storybook/react';
import CreateMaterialForm, { ICreateMaterialForm } from './CreateMaterialForm';
import { mockCreateMaterialFormProps } from './CreateMaterialForm.mocks';

export default {
  title: 'templates/CreateMaterialForm',
  component: CreateMaterialForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CreateMaterialForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CreateMaterialForm> = (args) => (
  <CreateMaterialForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCreateMaterialFormProps.base,
} as ICreateMaterialForm;
