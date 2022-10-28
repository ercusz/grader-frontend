import { IAddStudentDialog } from './AddStudentDialog';

const base: IAddStudentDialog = {
  classroomSlug: '',
  open: false,
  handleClose: function (): void {
    throw new Error('Function not implemented.');
  },
};

export const mockAddStudentDialogProps = {
  base,
};
