import { ComponentMeta, ComponentStory } from '@storybook/react';
import SourceCodeSection, { ISourceCodeSection } from './SourceCodeSection';
import { mockSourceCodeSectionProps } from './SourceCodeSection.mocks';

export default {
  title: 'templates/SourceCodeSection',
  component: SourceCodeSection,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SourceCodeSection>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SourceCodeSection> = (args) => (
  <SourceCodeSection {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSourceCodeSectionProps.base,
} as ISourceCodeSection;
