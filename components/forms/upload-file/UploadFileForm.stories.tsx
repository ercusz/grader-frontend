import { ComponentMeta, ComponentStory } from '@storybook/react';
import UploadFileForm, { IUploadFileForm } from './UploadFileForm';
import { mockUploadFileFormProps } from './UploadFileForm.mocks';

export default {
  title: 'templates/UploadFileForm',
  component: UploadFileForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof UploadFileForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UploadFileForm> = (args) => (
  <UploadFileForm {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockUploadFileFormProps.base,
} as IUploadFileForm;
