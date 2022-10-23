import { IDeleteConfirmationDialog } from './DeleteConfirmationDialog';

const base: IDeleteConfirmationDialog = {
  actionName: '',
  confirmText: '',
  open: false,
  handleClose: function (): void {
    throw new Error('Function not implemented.');
  },
  onSubmit: function (): void {
    throw new Error('Function not implemented.');
  },
};

export const mockDeleteConfirmationDialogProps = {
  base,
};
