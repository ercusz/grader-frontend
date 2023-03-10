import { ComponentMeta, ComponentStory } from '@storybook/react';
import SubMaterialCard, { ISubMaterialCard } from './SubMaterialCard';
import { mockSubMaterialCardProps } from './SubMaterialCard.mocks';

export default {
  title: 'templates/SubMaterialCard',
  component: SubMaterialCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SubMaterialCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SubMaterialCard> = (args) => (
  <SubMaterialCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSubMaterialCardProps.base,
} as ISubMaterialCard;
