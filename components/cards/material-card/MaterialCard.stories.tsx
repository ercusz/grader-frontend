import { ComponentMeta, ComponentStory } from '@storybook/react';
import MaterialCard, { IMaterialCard } from './MaterialCard';
import { mockMaterialCardProps } from './MaterialCard.mocks';

export default {
  title: 'templates/MaterialCard',
  component: MaterialCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof MaterialCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MaterialCard> = (args) => (
  <MaterialCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockMaterialCardProps.base,
} as IMaterialCard;
