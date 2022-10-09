import { ComponentMeta, ComponentStory } from '@storybook/react';
import TeacherAssistantsTable, {
  ITeacherAssistantsTable,
} from './TeacherAssistantsTable';
import { mockTeacherAssistantsTableProps } from './TeacherAssistantsTable.mocks';

export default {
  title: 'templates/TeacherAssistantsTable',
  component: TeacherAssistantsTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TeacherAssistantsTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TeacherAssistantsTable> = (args) => (
  <TeacherAssistantsTable {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockTeacherAssistantsTableProps.base,
} as ITeacherAssistantsTable;
