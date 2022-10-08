import { ComponentMeta, ComponentStory } from '@storybook/react';
import UploadCoverImageForm, {
  IUploadCoverImageForm,
} from './UploadCoverImageForm';
import { mockUploadCoverImageFormProps } from './UploadCoverImageForm.mocks';

export default {
  title: 'templates/UploadCoverImageForm',
  component: UploadCoverImageForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof UploadCoverImageForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UploadCoverImageForm> = (args) => (
  <UploadCoverImageForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockUploadCoverImageFormProps.base,
} as IUploadCoverImageForm;
