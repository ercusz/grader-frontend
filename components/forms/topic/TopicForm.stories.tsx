import { ComponentMeta, ComponentStory } from '@storybook/react';
import TopicForm, { ITopicForm } from './TopicForm';
import { mockTopicFormProps } from './TopicForm.mocks';

export default {
  title: 'templates/TopicForm',
  component: TopicForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TopicForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TopicForm> = (args) => (
  <TopicForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockTopicFormProps.base,
} as ITopicForm;
