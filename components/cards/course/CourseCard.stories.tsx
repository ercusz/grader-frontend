import { ComponentMeta, ComponentStory } from '@storybook/react';
import CourseCard, { ICourseCard } from './CourseCard';
import { mockCourseCardProps } from './CourseCard.mocks';

export default {
  title: 'cards/CourseCard',
  component: CourseCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CourseCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CourseCard> = (args) => (
  <CourseCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCourseCardProps.base,
} as ICourseCard;
