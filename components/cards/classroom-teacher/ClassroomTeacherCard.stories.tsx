import { ComponentMeta, ComponentStory } from '@storybook/react';
import ClassroomTeacherCard, {
  IClassroomTeacherCard,
} from './ClassroomTeacherCard';
import { mockClassroomTeacherCardProps } from './ClassroomTeacherCard.mocks';

export default {
  title: 'cards/ClassroomTeacherCard',
  component: ClassroomTeacherCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ClassroomTeacherCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ClassroomTeacherCard> = (args) => (
  <ClassroomTeacherCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockClassroomTeacherCardProps.base,
} as IClassroomTeacherCard;
