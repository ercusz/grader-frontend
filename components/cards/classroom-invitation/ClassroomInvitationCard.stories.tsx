import { ComponentMeta, ComponentStory } from '@storybook/react';
import ClassroomInvitationCard, {
  IClassroomInvitationCard,
} from './ClassroomInvitationCard';
import { mockClassroomInvitationCardProps } from './ClassroomInvitationCard.mocks';

export default {
  title: 'cards/ClassroomInvitationCard',
  component: ClassroomInvitationCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ClassroomInvitationCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ClassroomInvitationCard> = (args) => (
  <ClassroomInvitationCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockClassroomInvitationCardProps.base,
} as IClassroomInvitationCard;
