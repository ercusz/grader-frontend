import { IUploadedStudentsDialog } from './UploadedStudentsDialog';

const base: IUploadedStudentsDialog = {
  open: true,
  setOpen: () => {
    console.log('call setOpen');
  },
  classroom: {
    name: 'Section 1',
    students: ['623456789-0', '623456789-1', '623456789-2']
  }
};

export const mockUploadedStudentsDialogProps = {
  base,
};
