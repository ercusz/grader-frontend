import { ComponentMeta, ComponentStory } from '@storybook/react';
import StudentSubmissionsDrawer, {
  IStudentSubmissionsDrawer,
} from './StudentSubmissionsDrawer';
import { mockStudentSubmissionsDrawerProps } from './StudentSubmissionsDrawer.mocks';

export default {
  title: 'templates/StudentSubmissionsDrawer',
  component: StudentSubmissionsDrawer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof StudentSubmissionsDrawer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof StudentSubmissionsDrawer> = (args) => (
  <StudentSubmissionsDrawer {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockStudentSubmissionsDrawerProps.base,
} as IStudentSubmissionsDrawer;
