import { ComponentMeta, ComponentStory } from '@storybook/react';
import CourseClassroomCard, {
  ICourseClassroomCard,
} from './CourseClassroomCard';
import { mockCourseClassroomCardProps } from './CourseClassroomCard.mocks';

export default {
  title: 'cards/CourseClassroomCard',
  component: CourseClassroomCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CourseClassroomCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CourseClassroomCard> = (args) => (
  <CourseClassroomCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCourseClassroomCardProps.base,
} as ICourseClassroomCard;
