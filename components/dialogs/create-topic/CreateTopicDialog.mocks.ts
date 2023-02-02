import { ICreateTopicDialog } from './CreateTopicDialog';

const base: ICreateTopicDialog = {
  open: true,
  setOpen: () => {
    console.log('call setOpen');
  },
  input: 'John\nDoe',
  setInput: () => {
    console.log('call setInput');
  },
};

export const mockCreateTopicDialogProps = {
  base,
};
