import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import { IUploadCoverImageForm } from './UploadCoverImageForm';

const base: IUploadCoverImageForm = {
  acceptedFiles: [],
  getRootProps: function <T extends DropzoneRootProps>(props?: T | undefined): T {
    throw new Error('Function not implemented.');
  },
  getInputProps: function <T extends DropzoneInputProps>(props?: T | undefined): T {
    throw new Error('Function not implemented.');
  }
};

export const mockUploadCoverImageFormProps = {
  base,
};
