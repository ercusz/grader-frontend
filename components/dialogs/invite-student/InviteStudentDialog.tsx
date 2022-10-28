import { useClassroomSlug } from '@/states/classrooms/useClassrooms';
import { inviteStudentsToClassroom } from '@/utils/ClassroomService';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { read, utils } from 'xlsx';

export interface IInviteStudentDialog {
  classroomSlug: string;
  open: boolean;
  handleClose: () => void;
}

const studentListAtom = atom<string[]>([]);

const InviteStudentDialog: React.FC<IInviteStudentDialog> = ({
  classroomSlug,
  open,
  handleClose,
}) => {
  const [studentList, setStudentList] = useAtom(studentListAtom);

  const formContext = useForm();
  const { watch, register, handleSubmit } = formContext;
  const studentId = watch('studentId');

  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const queryClient = useQueryClient();
  const inviteStudentMutation = useMutation(
    (students: string[]) =>
      inviteStudentsToClassroom(students, classroom?.id as number),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['classroom', { slug: classroom?.slug }]);
        alert('ส่งคำเชิญเข้าร่วมคลาสเรียนให้นักศึกษาสำเร็จ');
        setStudentList([]);
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการส่งคำเชิญเข้าคลาสเรียนให้นักศึกษา');
      },
    }
  );

  const removeDuplicateStudentId = (arr: string[]) => {
    return Array.from(new Set(arr));
  };

  const onSubmit = () => {
    if (studentId) {
      setStudentList((prev) => removeDuplicateStudentId([...prev, studentId]));
    }
  };

  const handleRemoveButton = (studentId: string) => {
    const index = studentList.indexOf(studentId);
    if (index > -1) {
      setStudentList((prev) => prev.filter((stdId) => stdId !== studentId));
    }
  };

  const handleSaveButton = () => {
    if (studentList.length > 0) {
      inviteStudentMutation.mutate(studentList);
    }
  };

  const isUserAlreadyStudent = (studentId: string) => {
    return classroom
      ? classroom.students.some((s) => s.studentId === studentId)
      : false;
  };

  const onUpload = async (event: any) => {
    const ws = await event.target.files[0].arrayBuffer();
    const wb = read(ws);
    const json = utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]], {
      blankrows: false,
      range: 'B1:B100',
    });
    const students: string[] = json.flatMap((row) => {
      const key = Object.keys(row)[0];
      const studentId = row[key];
      const isStudentId = /^[0-9]{9}[-][0-9]$/.test(studentId);
      return isStudentId ? studentId : [];
    });

    if (students.length > 0) {
      setStudentList((prev) =>
        removeDuplicateStudentId([...prev, ...students])
      );
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>
        เชิญนักศึกษา
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormContainer formContext={formContext}>
          <Button
            fullWidth
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            อัปโหลดไฟล์
            <input
              type="file"
              {...register('students', {
                onChange: (data) => {
                  onUpload(data);
                },
              })}
              hidden
              accept=".xls, .xlsx"
            />
          </Button>
          <Divider sx={{ py: 2 }}>หรือ</Divider>
          <TextFieldElement
            fullWidth
            size="small"
            placeholder="กรอกรหัสนักศึกษา"
            label="รหัสนักศึกษา"
            autoComplete="off"
            name="studentId"
            validation={{
              pattern: {
                value: /^[0-9]{9}[-][0-9]$/,
                message: 'กรุณากรอกรหัสนักศึกษาให้ถูกต้อง',
              },
            }}
            onKeyPress={(e) => {
              e.key === 'Enter' && e.preventDefault();
            }}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  disableElevation
                  sx={{ p: 0 }}
                  onClick={() => handleSubmit(() => onSubmit())()}
                >
                  เพิ่ม
                </Button>
              ),
            }}
          />
        </FormContainer>
        {studentList.length > 0 && (
          <>
            <Typography sx={{ mt: 4 }} variant="body2" component="div">
              รายการนักศึกษา
            </Typography>
            <Paper
              variant="outlined"
              elevation={0}
              sx={{ maxHeight: 200, overflow: 'auto' }}
            >
              <List dense>
                {studentList.map((student) => (
                  <ListItem
                    divider
                    key={student}
                    sx={{ py: 2 }}
                    secondaryAction={
                      <Tooltip title="ลบออกจากรายการ">
                        <IconButton
                          edge="end"
                          aria-label="delete-from-list"
                          onClick={() => handleRemoveButton(student)}
                        >
                          <DeleteIcon fontSize="medium" color="error" />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemText
                      primary={student}
                      secondary={
                        isUserAlreadyStudent(student)
                          ? 'อยู่ในคลาสเรียนแล้ว'
                          : ''
                      }
                      secondaryTypographyProps={{
                        color: isUserAlreadyStudent(student)
                          ? 'error'
                          : 'textPrimary',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 5 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleSaveButton}
          disabled={studentList.length < 1}
          fullWidth
        >
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteStudentDialog;
