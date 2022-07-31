import { IInputDialog } from './InputDialog';

const base: IInputDialog = {
  open: true,
  setOpen: () => {
    console.log('call setOpen');
  },
  input: 'John\nDoe',
  setInput: () => {
    console.log('call setInput');
  },
};

export const mockInputDialogProps = {
  base,
};
