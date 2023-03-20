import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useDebounce } from '@/hooks/debounce/useDebounce';
import { UserResponse } from '@/types/types';
import { addTaToClassroom, findUser } from '@/utils/ClassroomService';
import { getImagePath } from '@/utils/imagePath';
import { getUserFullName } from '@/utils/UserService';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import GppGoodIcon from '@mui/icons-material/GppGood';
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

export interface IAddTeacherAssistantDialog {
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
const AddTeacherAssistantDialog: React.FC<IAddTeacherAssistantDialog> = ({
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

  const addTaMutation = useMutation(
    (taId: number) => addTaToClassroom(taId, classroom?.id as number),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['classroom', { slug: classroom?.slug }]);
        alert('เพิ่มผู้ช่วยสอนเข้าคลาสเรียนสำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการเพิ่มผู้ช่วยสอนเข้าคลาสเรียน');
      },
    }
  );

  const handleSearchButton = () => {
    refetch();
  };

  const handleAddTaButton = (ta: UserResponse) => {
    addTaMutation.mutate(ta.id);
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

  const isUserAlreadyTa = (ta: UserResponse) => {
    return classroom
      ? classroom.teacherAssistants.some((t) => t.id === ta.id)
      : false;
  };

  return (
    <Dialog open={open}>
      <DialogTitle>
        เพิ่มผู้ช่วยสอน
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
                  isUserAlreadyTa(user) ? (
                    <Tooltip title="เป็นผู้ช่วยสอนอยู่แล้ว">
                      <IconButton edge="end">
                        <GppGoodIcon color="success" fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="แต่งตั้งเป็นผู้ช่วยสอน">
                      <IconButton
                        edge="end"
                        aria-label="add-to-classroom"
                        onClick={() => handleAddTaButton(user)}
                      >
                        <AddIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt={getUserFullName(user)}
                    src={getImagePath(user.profileImage)}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={getUserFullName(user)}
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

export default AddTeacherAssistantDialog;
