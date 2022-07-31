import { ComponentMeta, ComponentStory } from '@storybook/react';
import TestCasesList, { ITestCasesList } from './TestCasesList';
import { mockTestCasesListProps } from './TestCasesList.mocks';

export default {
  title: 'editors/TestCasesList',
  component: TestCasesList,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TestCasesList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TestCasesList> = (args) => (
  <TestCasesList {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockTestCasesListProps.base,
} as ITestCasesList;
