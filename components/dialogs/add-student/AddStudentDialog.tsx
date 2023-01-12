import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useDebounce } from '@/hooks/debounce/useDebounce';
import { UserResponse } from '@/types/types';
import { addStudentToClassroom, findUser } from '@/utils/ClassroomService';
import { getImagePath } from '@/utils/imagePath';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  FormContainer,
  RadioButtonGroup,
  TextFieldElement,
} from 'react-hook-form-mui';

export interface IAddStudentDialog {
  classroomSlug: string;
  open: boolean;
  handleClose: () => void;
}

const UserListItemSkeleton = () => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Skeleton variant="circular" width={40} height={40} />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton animation="wave" height={20} width="80%" />}
        secondary={<Skeleton animation="wave" height={10} width="40%" />}
      />
    </ListItem>
  );
};

const AddStudentDialog: React.FC<IAddStudentDialog> = ({
  classroomSlug,
  open,
  handleClose,
}) => {
  const formContext = useForm({
    defaultValues: {
      search: '',
      searchType: 'username',
    },
  });
  const { watch } = formContext;
  const searchValue = watch('search');
  const searchType = watch('searchType');

  const debouncedFilter: string = useDebounce<string>(searchValue, 500);

  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery<UserResponse[], Error>(
    ['users', debouncedFilter],
    () => findUser({ [searchType]: debouncedFilter }),
    {
      enabled: Boolean(debouncedFilter && debouncedFilter.length >= 4),
      initialData: [],
    }
  );
  const queryClient = useQueryClient();

  const addStudentMutation = useMutation(
    (studentId: number) =>
      addStudentToClassroom(studentId, classroom?.id as number),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['classroom', { slug: classroom?.slug }]);
        alert('เพิ่มนักศึกษาเข้าคลาสเรียนสำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการเพิ่มนักศึกษาเข้าคลาสเรียน');
      },
    }
  );

  const handleSearchButton = () => {
    refetch();
  };

  const handleAddStudentButton = (student: UserResponse) => {
    addStudentMutation.mutate(student.id);
  };

  const getPlaceHolderText = () => {
    if (searchType === 'username') {
      return 'กรอกชื่อผู้ใช้';
    } else if (searchType === 'email') {
      return 'กรอกอีเมล';
    } else if (searchType === 'studentId') {
      return 'กรอกรหัสนักศึกษา';
    }
  };

  const getStudentName = (student: UserResponse) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }

    return 'ยังไม่ตั้งชื่อ';
  };

  const isUserAlreadyStudent = (student: UserResponse) => {
    return classroom
      ? classroom.students.some((s) => s.id === student.id)
      : false;
  };

  return (
    <Dialog open={open}>
      <DialogTitle>
        เพิ่มนักศึกษา
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
        <FormContainer formContext={formContext} onSuccess={handleSearchButton}>
          <TextFieldElement
            fullWidth
            size="small"
            type="search"
            placeholder={getPlaceHolderText()}
            autoComplete="off"
            name="search"
            helperText={
              <RadioButtonGroup
                name="searchType"
                row
                options={[
                  {
                    id: 'username',
                    label: 'ชื่อผู้ใช้',
                  },
                  {
                    id: 'email',
                    label: 'อีเมล',
                  },
                  {
                    id: 'studentId',
                    label: 'รหัสนักศึกษา',
                  },
                ]}
              />
            }
            FormHelperTextProps={{
              // @ts-expect-error
              component: 'div',
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearchButton}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </FormContainer>
        <Typography sx={{ mt: 1 }} variant="body2" component="div">
          ผลการค้นหา
        </Typography>
        <List dense>
          {isLoading && <UserListItemSkeleton />}
          {users.length < 1 ? (
            <Typography>ไม่พบผู้ใช้</Typography>
          ) : (
            users?.map((user: UserResponse) => (
              <ListItem
                key={user.id}
                secondaryAction={
                  isUserAlreadyStudent(user) ? (
                    <Tooltip title="เป็นนักศึกษาในคลาสเรียนนี้อยู่แล้ว">
                      <IconButton edge="end">
                        <HowToRegIcon color="success" fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="เพิ่มเข้าคลาสเรียน">
                      <IconButton
                        edge="end"
                        aria-label="add-to-classroom"
                        onClick={() => handleAddStudentButton(user)}
                      >
                        <AddIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt={getStudentName(user)}
                    src={getImagePath(user.profileImage)}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={getStudentName(user)}
                  secondary={`@${user.username}`}
                />
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
