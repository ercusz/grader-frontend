import { ComponentMeta, ComponentStory } from '@storybook/react';
import MaterialContentCard, {
  IMaterialContentCard,
} from './MaterialContentCard';
import { mockMaterialContentCardProps } from './MaterialContentCard.mocks';

export default {
  title: 'templates/MaterialContentCard',
  component: MaterialContentCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof MaterialContentCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MaterialContentCard> = (args) => (
  <MaterialContentCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockMaterialContentCardProps.base,
} as IMaterialContentCard;
