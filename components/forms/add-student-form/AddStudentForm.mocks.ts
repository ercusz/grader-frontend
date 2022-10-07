import { IAddStudentForm } from './AddStudentForm';

const base: IAddStudentForm = {
  classrooms: [
    {
      name: 'Section 1',
      students: [],
    },
    {
      name: 'Section 2',
      students: [],
    },
    {
      name: 'Section 3',
      students: [],
    },
  ],
  setClassrooms: () => {
    console.log('call setClassrooms');
  },
};

export const mockAddStudentFormProps = {
  base,
};
