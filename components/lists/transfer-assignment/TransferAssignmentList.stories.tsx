import { ComponentMeta, ComponentStory } from '@storybook/react';
import TransferAssignmentList, {
  ITransferAssignmentList,
} from './TransferAssignmentList';
import { mockTransferAssignmentListProps } from './TransferAssignmentList.mocks';

export default {
  title: 'templates/TransferAssignmentList',
  component: TransferAssignmentList,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TransferAssignmentList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TransferAssignmentList> = (args) => (
  <TransferAssignmentList {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockTransferAssignmentListProps.base,
} as ITransferAssignmentList;
