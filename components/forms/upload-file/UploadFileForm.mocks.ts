import { filesAtom } from '@/stores/create-material';
import { IUploadFileForm } from './UploadFileForm';

const base: IUploadFileForm = {
  filesAtom: filesAtom,
};

export const mockUploadFileFormProps = {
  base,
};
