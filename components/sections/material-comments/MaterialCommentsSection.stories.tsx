import { ComponentMeta, ComponentStory } from '@storybook/react';
import MaterialCommentsSection, {
  IMaterialCommentsSection,
} from './MaterialCommentsSection';
import { mockMaterialCommentsSectionProps } from './MaterialCommentsSection.mocks';

export default {
  title: 'templates/MaterialCommentsSection',
  component: MaterialCommentsSection,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof MaterialCommentsSection>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MaterialCommentsSection> = (args) => (
  <MaterialCommentsSection {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockMaterialCommentsSectionProps.base,
} as IMaterialCommentsSection;
