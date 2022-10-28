import { IInviteStudentDialog } from './InviteStudentDialog';

const base: IInviteStudentDialog = {
  classroomSlug: '',
  open: false,
  handleClose: function (): void {
    throw new Error('Function not implemented.');
  },
};

export const mockInviteStudentDialogProps = {
  base,
};
