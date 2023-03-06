import CompactSubmissionTestcasesSection from '@/components/sections/compact-submission-testcases/CompactSubmissionTestcasesSection';
import FilesSection from '@/components/sections/files/FilesSection';
import SourceCodeSection from '@/components/sections/source-code/SourceCodeSection';
import { useAssignment } from '@/hooks/assignment/useAssignment';
import { useStudentLatestSubmission } from '@/hooks/submission/useSubmission';
import { useUser } from '@/hooks/user/useUser';
import { Assignment, StudentSubmission, UserResponse } from '@/types/types';
import { getImagePath } from '@/utils/imagePath';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import { format, formatDistance, isAfter, isValid, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import { atom, useAtom } from 'jotai';
import { forwardRef, useMemo } from 'react';
import { VscCode } from 'react-icons/vsc';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const openDialogAtom = atom(false);

export interface ISubmissionDetailDialog {
  assignment: Assignment;
  studentSubmission: StudentSubmission;
}
const SubmissionDetailDialog: React.FC<ISubmissionDetailDialog> = ({
  assignment,
  studentSubmission,
}) => {
  const [openDialog, setOpenDialog] = useAtom(openDialogAtom);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const testcases = useMemo(() => {
    if (studentSubmission.submission?.testcases) {
      return studentSubmission.submission.testcases.map(
        ({ submissionData }) => submissionData
      );
    }
    return [];
  }, [studentSubmission.submission?.testcases]);

  const passedTestcases = useMemo(() => {
    return testcases.filter((testcase) => testcase.status === 3).length;
  }, [testcases]);

  const getStudentName = (student: UserResponse) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }

    return student.username;
  };

  return (
    <Dialog
      open={openDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="student-latest-submission-dialog"
      fullWidth
      maxWidth="md"
      sx={{
        borderRadius: '20px',
      }}
    >
      <DialogTitle>
        ข้อมูลการส่งงาน
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
      {studentSubmission.submission && (
        <DialogContent>
          {/* Submission Details */}
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 140,
                color: (theme) => alpha(theme.palette.primary.main, 0.1),
              }}
            >
              {assignment.type === 'java-src' && (
                <VscCode className="absolute -top-8 -right-2 -rotate-12" />
              )}
              {assignment.type === 'docs' && (
                <AssignmentIcon
                  className="absolute -top-2 -right-2 -rotate-12"
                  fontSize="inherit"
                />
              )}
            </Typography>
            <Stack direction="row" alignItems="center">
              <Avatar
                alt={`${studentSubmission.username}'s profile image`}
                src={getImagePath(studentSubmission.profileImage)}
                sx={{ mr: 2 }}
              >
                {studentSubmission.firstName && studentSubmission.lastName
                  ? studentSubmission.firstName?.charAt(0) +
                    studentSubmission.lastName?.charAt(0)
                  : studentSubmission.username?.charAt(0)}
              </Avatar>
              <Stack direction="column">
                <Typography variant="h6" color="primary" noWrap>
                  {getStudentName(studentSubmission)}
                </Typography>
                {isValid(parseISO(studentSubmission.submission.createdAt)) && (
                  <>
                    <Typography variant="body2" noWrap>
                      ส่งเมื่อ{' '}
                      {format(
                        parseISO(studentSubmission.submission.createdAt),
                        'PPp',
                        {
                          locale: th,
                        }
                      )}
                    </Typography>
                    {isAfter(
                      parseISO(studentSubmission.submission.createdAt),
                      parseISO(assignment.endDate)
                    ) && (
                      <Typography variant="caption" color="error" noWrap>
                        ส่งช้า{' '}
                        {formatDistance(
                          parseISO(studentSubmission.submission.createdAt),
                          parseISO(assignment.endDate),
                          {
                            locale: th,
                          }
                        )}
                      </Typography>
                    )}
                  </>
                )}
                {studentSubmission.submission?.type === 'java-src' && (
                  <Typography variant="body2" noWrap>
                    ผ่านชุดทดสอบ {passedTestcases}/{testcases.length} ชุด
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Paper>

          {/* Java Src Submission */}
          {studentSubmission.submission?.type === 'java-src' && (
            <Stack direction="column" spacing={1}>
              {/* Source Code Section */}
              {studentSubmission.submission.sourceCode && (
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <SourceCodeSection
                    sourceCode={studentSubmission.submission.sourceCode}
                  />
                </Paper>
              )}

              {/* Testcases Section */}
              {studentSubmission.submission?.testcases && (
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CompactSubmissionTestcasesSection testcases={testcases} />
                </Paper>
              )}
            </Stack>
          )}

          {/* Docs Submission */}
          {studentSubmission.submission?.type === 'docs' && (
            <Stack direction="column" spacing={1}>
              {/* Files Section */}
              {studentSubmission.submission.files &&
              studentSubmission.submission.files.length > 0 ? (
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <FilesSection files={studentSubmission.submission.files} />
                </Paper>
              ) : (
                <Alert severity="warning">ไม่พบไฟล์งานของคุณ</Alert>
              )}
            </Stack>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

export interface ISubmissionStatusCard {
  classroomId: string;
  assignmentId: string;
}

const SubmissionStatusCard: React.FC<ISubmissionStatusCard> = ({
  classroomId,
  assignmentId,
}) => {
  const { data: user } = useUser();
  const { data: studentSubmission } = useStudentLatestSubmission({
    classroomId: classroomId,
    assignmentId: assignmentId,
    studentId: user?.id.toString() as string,
  });
  const { data: assignment } = useAssignment({
    classroomId: classroomId,
    assignmentId: assignmentId,
  });

  const [, setOpenDialog] = useAtom(openDialogAtom);

  const isSubmit = Boolean(studentSubmission?.submission);

  return (
    <Alert
      className="w-full shadow-xl"
      severity={isSubmit ? 'success' : 'error'}
      icon={false}
      sx={{
        borderRadius: '4px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderOpacity: 0.12,
        '& .MuiAlert-message': {
          textAlign: 'center',
          width: 'inherit',
        },
      }}
    >
      <Divider sx={{ mb: 2 }}>
        <AlertTitle className="text-sm tracking-widest">
          สถานะการส่งงาน
        </AlertTitle>
      </Divider>
      <Stack className="w-full" direction="column">
        <Chip
          className="mx-auto mb-4"
          size="small"
          label={`${user?.firstName} ${user?.lastName}`}
          avatar={
            <Avatar
              alt={user ? `${user?.username}'s profile image` : undefined}
              src={user?.profileImage ? user.profileImage.url : undefined}
            >
              {user && user.firstName && user.lastName
                ? user.firstName?.charAt(0) + user.lastName?.charAt(0)
                : user?.username?.charAt(0)}
            </Avatar>
          }
        />
        <Stack
          direction="row"
          spacing={1}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Typography variant="h6">
            {isSubmit ? 'ส่งงานแล้ว' : 'ยังไม่ส่งงาน'}
          </Typography>
          {isSubmit ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />}
        </Stack>
        {isSubmit && studentSubmission?.submission && assignment && (
          <>
            {/* Dialog */}
            <SubmissionDetailDialog
              studentSubmission={studentSubmission}
              assignment={assignment}
            />
            <Stack>
              <Button
                color="success"
                variant="outlined"
                onClick={() => setOpenDialog(true)}
                sx={{
                  my: 2,
                }}
              >
                ดูรายละเอียด
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Alert>
  );
};

export default SubmissionStatusCard;
