import * as React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';

export interface IInputDialog {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

const InputDialog: React.FC<IInputDialog> = ({
  open,
  setOpen,
  input,
  setInput,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: { target: { value: any } }) => {
    setInput(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Custom Input</DialogTitle>
      <DialogContent>
        <DialogContentText>
          เมื่อคุณทำการ execute โปรแกรมของคุณ ระบบจะทำการอ่าน input นี้
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Custom Input"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          value={input}
          onChange={handleChange}
        />
        <DialogContentText variant="caption" style={{ whiteSpace: 'pre' }}>
          {input?.replace(/\s/g, '') !== ''
            ? 'Custom input ของคุณ คือ \n' + input
            : ''}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleClose}
          disabled={input?.replace(/\s/g, '') === '' ? true : false}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InputDialog;
