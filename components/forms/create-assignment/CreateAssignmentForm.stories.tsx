import { ComponentMeta, ComponentStory } from '@storybook/react';
import CreateAssignmentForm, {
  ICreateAssignmentForm,
} from './CreateAssignmentForm';
import { mockCreateAssignmentFormProps } from './CreateAssignmentForm.mocks';

export default {
  title: 'templates/CreateAssignmentForm',
  component: CreateAssignmentForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CreateAssignmentForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CreateAssignmentForm> = (args) => (
  <CreateAssignmentForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCreateAssignmentFormProps.base,
} as ICreateAssignmentForm;
