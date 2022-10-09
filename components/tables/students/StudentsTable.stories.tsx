import { ComponentMeta, ComponentStory } from '@storybook/react';
import StudentsTable, { IStudentsTable } from './StudentsTable';
import { mockStudentsTableProps } from './StudentsTable.mocks';

export default {
  title: 'templates/StudentsTable',
  component: StudentsTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof StudentsTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof StudentsTable> = (args) => (
  <StudentsTable {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockStudentsTableProps.base,
} as IStudentsTable;
