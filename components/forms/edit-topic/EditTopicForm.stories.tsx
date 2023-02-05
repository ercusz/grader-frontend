import { ComponentMeta, ComponentStory } from '@storybook/react';
import EditTopicForm, { IEditTopicForm } from './EditTopicForm';
import { mockEditTopicFormProps } from './EditTopicForm.mocks';

export default {
  title: 'templates/EditTopicForm',
  component: EditTopicForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof EditTopicForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EditTopicForm> = (args) => (
  <EditTopicForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockEditTopicFormProps.base,
} as IEditTopicForm;
