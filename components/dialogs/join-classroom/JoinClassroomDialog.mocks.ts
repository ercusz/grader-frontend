import { IJoinClassroomDialog } from './JoinClassroomDialog';

const base: IJoinClassroomDialog = {
  open: false,
  handleClose: function (): void {
    throw new Error('Function not implemented.');
  },
};

export const mockJoinClassroomDialogProps = {
  base,
};
