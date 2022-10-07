import { ComponentMeta, ComponentStory } from '@storybook/react';
import LessonFiltersList, { ILessonFiltersList } from './LessonFiltersList';
import { mockLessonFiltersListProps } from './LessonFiltersList.mocks';

export default {
  title: 'templates/LessonFiltersList',
  component: LessonFiltersList,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof LessonFiltersList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LessonFiltersList> = (args) => (
  <LessonFiltersList {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockLessonFiltersListProps.base,
} as ILessonFiltersList;
