import { ComponentMeta, ComponentStory } from '@storybook/react';
import AssignmentCommentsSection, {
  IAssignmentCommentsSection,
} from './AssignmentCommentsSection';
import { mockAssignmentCommentsSectionProps } from './AssignmentCommentsSection.mocks';

export default {
  title: 'templates/AssignmentCommentsSection',
  component: AssignmentCommentsSection,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AssignmentCommentsSection>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AssignmentCommentsSection> = (args) => (
  <AssignmentCommentsSection {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockAssignmentCommentsSectionProps.base,
} as IAssignmentCommentsSection;
