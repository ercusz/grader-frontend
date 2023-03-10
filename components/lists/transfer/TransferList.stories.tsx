import { ComponentMeta, ComponentStory } from '@storybook/react';
import TransferList, { ITransferList } from './TransferList';
import { mockTransferListProps } from './TransferList.mocks';

export default {
  title: 'templates/TransferList',
  component: TransferList,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TransferList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TransferList> = (args) => (
  <TransferList {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockTransferListProps.base,
} as ITransferList;
