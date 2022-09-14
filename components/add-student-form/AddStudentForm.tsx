import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Chip,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { read, utils } from 'xlsx';
import { CreateCourseClassroom } from '../../types/types';
import UploadedStudentsDialog from '../uploaded-students-dialog/UploadedStudentsDialog';

export interface IAddStudentForm {
  classrooms?: CreateCourseClassroom[];
  setClassrooms?: Dispatch<SetStateAction<CreateCourseClassroom[]>>;
  classroom?: CreateCourseClassroom;
  setClassroom?: Dispatch<SetStateAction<CreateCourseClassroom>>;
}

const AddStudentForm: React.FC<IAddStudentForm> = ({
  classrooms,
  setClassrooms,
  classroom,
  setClassroom,
}) => {
  const { register } = useForm();

  interface IUploadBtn {
    classroomName: string;
  }

  const UploadButton: React.FC<IUploadBtn> = ({ classroomName }) => {
    return (
      <Tooltip
        title={
          <>
            <Typography color="inherit">อัปโหลดรายชื่อนักศึกษา</Typography>
            {'กลุ่มการเรียน: '}
            <b>{classroomName}</b>
          </>
        }
      >
        <IconButton aria-label="upload" size="small" component="label">
          <CloudUploadIcon />
          <input
            type="file"
            {...register(classroomName, {
              onChange: (data) => {
                onSubmit(data, classroomName);
              },
            })}
            hidden
            accept=".xls, .xlsx"
          />
        </IconButton>
      </Tooltip>
    );
  };

  const onSubmit = async (event: any, classroomName: string) => {
    const ws = await event.target.files[0].arrayBuffer();
    const wb = read(ws);
    const json = utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]], {
      blankrows: false,
      range: 'B1:B100',
    });
    const students = json.flatMap((row) => {
      const key = Object.keys(row)[0];
      const studentId = row[key];
      const isStudentId = /^[0-9]{9}[-][0-9]$/.test(studentId);
      return isStudentId ? studentId : [];
    });

    if (students.length > 0) {
      if (classroom && setClassroom) {
        setClassroom({ ...classroom, students: students });
      }

      if (classrooms && setClassrooms) {
        const newData = classrooms.map((obj: any) => {
          if (obj.name === classroomName) {
            obj.students = students;
          }

          return obj;
        });

        setClassrooms(newData);
      }
    }
  };

  useEffect(() => {}, [classrooms]);

  const [openModal, setOpenModal] = useState(false);

  const [modalClassroom, setModalClassroom] = useState<CreateCourseClassroom>({
    name: '',
    students: [],
  });

  const handleOpen = (classroom: CreateCourseClassroom) => {
    setModalClassroom(classroom);
    setOpenModal(true);
  };

  return (
    <form>
      {classroom ? (
        <>
          <Typography py={2}>กลุ่มการเรียน: {classroom.name}</Typography>
          <UploadButton classroomName={classroom.name} />
        </>
      ) : classrooms && classrooms.length > 0 ? (
        <Table aria-label="upload student to classroom table">
          <TableHead>
            <TableRow>
              <TableCell>กลุ่มการเรียน</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classrooms?.map((cls: CreateCourseClassroom) => (
              <TableRow
                key={cls.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {cls.name}
                </TableCell>
                <TableCell align="right">
                  <UploadButton classroomName={cls.name} />
                </TableCell>
                <TableCell align="right">
                  {cls.students.length < 1 ? (
                    <Typography color="error">ไม่พบข้อมูลนักศึกษา</Typography>
                  ) : (
                    <Link
                      component="button"
                      variant="body2"
                      type="button"
                      onClick={() => {
                        handleOpen(cls);
                      }}
                    >
                      ดูรายการนักศึกษา
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Stack direction="row" sx={{py: 2}} alignItems="center">
          <WarningIcon color="warning" sx={{pr: 0.5}}/>
          <Typography>กรุณาเพิ่มกลุ่มการเรียนก่อนเพิ่มนักศึกษา</Typography>
        </Stack>
      )}
      <UploadedStudentsDialog
        open={openModal}
        setOpen={setOpenModal}
        classroom={modalClassroom}
      />
    </form>
  );
};

export default AddStudentForm;
