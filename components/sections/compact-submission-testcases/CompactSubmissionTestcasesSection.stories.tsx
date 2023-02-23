import { ComponentMeta, ComponentStory } from '@storybook/react';
import CompactSubmissionTestcasesSection, {
  ICompactSubmissionTestcasesSection,
} from './CompactSubmissionTestcasesSection';
import { mockCompactSubmissionTestcasesSectionProps } from './CompactSubmissionTestcasesSection.mocks';

export default {
  title: 'templates/CompactSubmissionTestcasesSection',
  component: CompactSubmissionTestcasesSection,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CompactSubmissionTestcasesSection>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CompactSubmissionTestcasesSection> = (
  args
) => <CompactSubmissionTestcasesSection {...args} />;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCompactSubmissionTestcasesSectionProps.base,
} as ICompactSubmissionTestcasesSection;
