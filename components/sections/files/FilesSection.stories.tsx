import { ComponentMeta, ComponentStory } from '@storybook/react';
import FilesSection, { IFilesSection } from './FilesSection';
import { mockFilesSectionProps } from './FilesSection.mocks';

export default {
  title: 'templates/FilesSection',
  component: FilesSection,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof FilesSection>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FilesSection> = (args) => (
  <FilesSection {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockFilesSectionProps.base,
} as IFilesSection;
