import { ComponentMeta, ComponentStory } from '@storybook/react';
import SubmissionTestcasesSection, {
  ISubmissionTestcasesSection,
} from './SubmissionTestcasesSection';
import { mockSubmissionTestcasesSectionProps } from './SubmissionTestcasesSection.mocks';

export default {
  title: 'templates/SubmissionTestcasesSection',
  component: SubmissionTestcasesSection,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SubmissionTestcasesSection>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SubmissionTestcasesSection> = (args) => (
  <SubmissionTestcasesSection {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSubmissionTestcasesSectionProps.base,
} as ISubmissionTestcasesSection;
