import { IAddTeacherAssistantDialog } from './AddTeacherAssistantDialog';

const base: IAddTeacherAssistantDialog = {
  classroomSlug: '',
  open: false,
  handleClose: function (): void {
    throw new Error('Function not implemented.');
  }
};

export const mockAddTeacherAssistantDialogProps = {
  base,
};
