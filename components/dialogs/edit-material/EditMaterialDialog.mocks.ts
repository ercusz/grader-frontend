import { IEditMaterialDialog } from './EditMaterialDialog';

const base: IEditMaterialDialog = {
  material: {
    id: 0,
    classroomId: 0,
    title: '',
    publishedDate: '',
    content: '',
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
    updateBy: null,
    topic: null,
    files: [],
  },
};

export const mockEditMaterialDialogProps = {
  base,
};
