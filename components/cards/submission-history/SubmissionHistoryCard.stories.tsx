import { ComponentMeta, ComponentStory } from '@storybook/react';
import SubmissionHistoryCard, {
  ISubmissionHistoryCard,
} from './SubmissionHistoryCard';
import { mockSubmissionHistoryCardProps } from './SubmissionHistoryCard.mocks';

export default {
  title: 'templates/SubmissionHistoryCard',
  component: SubmissionHistoryCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SubmissionHistoryCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SubmissionHistoryCard> = (args) => (
  <SubmissionHistoryCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSubmissionHistoryCardProps.base,
} as ISubmissionHistoryCard;
