import { ComponentMeta, ComponentStory } from '@storybook/react';
import InviteCodeCard, { IInviteCodeCard } from './InviteCodeCard';
import { mockInviteCodeCardProps } from './InviteCodeCard.mocks';

export default {
  title: 'templates/InviteCodeCard',
  component: InviteCodeCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof InviteCodeCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof InviteCodeCard> = (args) => (
  <InviteCodeCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockInviteCodeCardProps.base,
} as IInviteCodeCard;
