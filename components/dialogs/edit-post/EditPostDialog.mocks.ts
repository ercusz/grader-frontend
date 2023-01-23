import { SetStateAction } from 'react';
import { IEditPostDialog } from './EditPostDialog';

const base: IEditPostDialog = {
  post: {
    id: 0,
    classroomId: 0,
    content: '',
    isPinned: false,
    createdAt: '',
    createBy: {
      id: 0,
      firstName: null,
      lastName: null,
      username: '',
      profileImage: null,
      studentId: undefined,
    },
    updatedAt: '',
  },
  openDialog: false,
  setOpenDialog: function (value: SetStateAction<boolean>): void {
    throw new Error('Function not implemented.');
  },
};

export const mockEditPostDialogProps = {
  base,
};
