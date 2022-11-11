import { useClassroomSlug } from '@/states/classrooms/useClassrooms';
import { inviteStudentsToClassroom } from '@/utils/ClassroomService';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format, formatDistanceToNow, isValid } from 'date-fns';
import { th } from 'date-fns/locale';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  DatePickerElement,
  FormContainer,
  TextFieldElement,
} from 'react-hook-form-mui';
import { read, utils } from 'xlsx';

export interface IInviteStudentDialog {
  classroomSlug: string;
  open: boolean;
  handleClose: () => void;
}

const studentListAtom = atom<string[]>([]);
const enabledExpireDateAtom = atom<boolean>(false);

const InviteStudentDialog: React.FC<IInviteStudentDialog> = ({
  classroomSlug,
  open,
  handleClose,
}) => {
  const [studentList, setStudentList] = useAtom(studentListAtom);
  const [enabledExpireDate, setEnabledExpireDate] = useAtom(
    enabledExpireDateAtom
  );

  const tomorrowDate = new Date(new Date().setDate(new Date().getDate() + 1));

  useEffect(() => {
    if (studentList.length < 1) {
      setEnabledExpireDate(false);
    }
  }, [setEnabledExpireDate, studentList]);

  const studentFormContext = useForm();
  const {
    watch: watchStudent,
    register: registerStudent,
    handleSubmit: handleSubmitStudent,
  } = studentFormContext;
  const studentId = watchStudent('studentId');

  const expireDateFormContext = useForm({
    defaultValues: {
      expireDate: tomorrowDate,
    },
  });
  const { watch: watchExpireDate, handleSubmit: handleSubmitExpireDate } =
    expireDateFormContext;
  const expireDate = watchExpireDate('expireDate');

  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const queryClient = useQueryClient();
  interface IInviteStudentMutation {
    students: string[];
    expireDate?: Date;
  }
  const inviteStudentMutation = useMutation(
    (params: IInviteStudentMutation) =>
      inviteStudentsToClassroom(
        params.students,
        classroom?.id as number,
        params.expireDate
      ),
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

  const onSubmitStudentId = () => {
    if (studentId) {
      setStudentList((prev) => removeDuplicateStudentId([...prev, studentId]));
    }
  };

  const onSave = () => {
    if (studentList.length > 0) {
      inviteStudentMutation.mutate({
        students: studentList,
        expireDate: enabledExpireDate ? expireDate : undefined,
      });
    }
  };

  const handleRemoveButton = (studentId: string) => {
    const index = studentList.indexOf(studentId);
    if (index > -1) {
      setStudentList((prev) => prev.filter((stdId) => stdId !== studentId));
    }
  };

  const isReadyToSave =
    studentList.length > 0 && (enabledExpireDate ? isValid(expireDate) : true);

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
        <Stack direction="column" spacing={4}>
          <FormContainer formContext={studentFormContext}>
            <Button
              fullWidth
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              อัปโหลดไฟล์
              <input
                type="file"
                {...registerStudent('students', {
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
                    onClick={() =>
                      handleSubmitStudent(() => onSubmitStudentId())()
                    }
                  >
                    เพิ่ม
                  </Button>
                ),
              }}
            />
          </FormContainer>
          {studentList.length > 0 && (
            <Box>
              <Typography variant="body2" component="div">
                รายการนักศึกษา
              </Typography>
              <Paper
                variant="outlined"
                elevation={0}
                sx={{ maxHeight: 200, overflow: 'auto' }}
              >
                <List dense>
                  {studentList.map((student, idx) => (
                    <ListItem
                      divider={idx !== studentList.length - 1}
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
            </Box>
          )}
          <FormContainer formContext={expireDateFormContext}>
            <FormControlLabel
              control={
                <Switch
                  checked={enabledExpireDate}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setEnabledExpireDate(event.target.checked)
                  }
                  disabled={studentList.length < 1}
                />
              }
              label="วันหมดอายุของคำเชิญ"
              sx={{ mb: 2 }}
            />
            <Box sx={{ visibility: enabledExpireDate ? 'visible' : 'hidden' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePickerElement
                  className="w-full"
                  label="วันหมดอายุ"
                  name="expireDate"
                  required={enabledExpireDate}
                  validation={{
                    required: 'กรุณาเลือกวันหมดอายุของคำเชิญ',
                  }}
                  minDate={tomorrowDate} // minDate is tomorrow
                />
                {isValid(expireDate) && (
                  <Typography variant="caption" noWrap component="span">
                    {`วันหมดอายุของคำเชิญ: ${format(expireDate, 'PPP', {
                      locale: th,
                    })}`}
                    {` (${formatDistanceToNow(expireDate, {
                      locale: th,
                      addSuffix: true,
                    })})`}
                  </Typography>
                )}
              </LocalizationProvider>
            </Box>
          </FormContainer>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 5 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleSubmitExpireDate(() => onSave())()}
          disabled={!isReadyToSave}
          fullWidth
        >
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteStudentDialog;
