import { ComponentMeta, ComponentStory } from '@storybook/react';
import AddSectionForm, { IAddSectionForm } from './AddSectionForm';
import { mockAddSectionFormProps } from './AddSectionForm.mocks';

export default {
  title: 'templates/AddSectionForm',
  component: AddSectionForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AddSectionForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddSectionForm> = (args) => (
  <AddSectionForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockAddSectionFormProps.base,
} as IAddSectionForm;
