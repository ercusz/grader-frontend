import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useAssignmentSubmissions } from '@/hooks/submission/useSubmission';
import {
  enabledPointDeductionAtom,
  selectedSubmissionsAtom,
} from '@/stores/assignment-submissions';
import { StudentSubmission, UserResponse } from '@/types/types';
import { getImagePath } from '@/utils/imagePath';
import {
  calculateDeductPoint,
  gradingStudentScore,
} from '@/utils/SubmissionService';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export interface IStudentGradedScoreDialog {
  point: number;
}

export const openStudentGradedScoreDialogAtom = atom(false);

const StudentGradedScoreDialog: React.FC<IStudentGradedScoreDialog> = ({
  point,
}) => {
  const [open, setOpen] = useAtom(openStudentGradedScoreDialogAtom);

  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter();
  const { slug, assignmentId } = router.query;
  const { data: classroom } = useClassroomSlug({ slug: slug as string });
  const { data: assignment, data: { students } = {} } =
    useAssignmentSubmissions({
      classroomId: classroom?.id.toString() as string,
      assignmentId: assignmentId?.toString() as string,
    });

  const [selected, setSelected] = useAtom(selectedSubmissionsAtom);
  const [enabledPointDeduction, setEnabledPointDeduction] = useAtom(
    enabledPointDeductionAtom
  );

  const maxPoint = useMemo(() => {
    return assignment?.point ?? 0;
  }, [assignment]);

  const getStudentName = (student: UserResponse) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }

    return student.username;
  };

  const studentWithScores = useMemo(() => {
    return (students &&
      selected.map((selectedStudentId) => {
        const student = students.find(
          (student) => student.id === selectedStudentId
        );

        if (student && assignment) {
          let score = point;
          if (student.submission) {
            const { submission } = student;
            if (enabledPointDeduction) {
              const { deductPoint, deductType, minPoint } = assignment;

              const { point: calculatedScore } = calculateDeductPoint({
                point: point,
                minPoint: minPoint || 0,
                dueDate: assignment.endDate,
                submittedDate: submission.createdAt,
                deductPoint: deductPoint || 0,
                deductType: deductType || 'day',
              });

              score = calculatedScore;
            }
          }

          return {
            student,
            score,
          };
        }
        return null;
      })) as { student: StudentSubmission; score: number }[];
  }, [assignment, enabledPointDeduction, point, selected, students]);

  const queryClient = useQueryClient();
  const mutation = useMutation(
    () =>
      gradingStudentScore(
        assignment?.id.toString() as string,
        classroom?.id.toString() as string,
        studentWithScores.map(({ student, score }) => ({
          id: student.id,
          score,
        })) as { id: number; score: number }[]
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'submissions',
          { assignmentId: assignment?.id },
        ]);
        setSelected([]);
        setEnabledPointDeduction(false);
        setOpen(false);
        alert('ลงคะแนนนักศึกษาเรียบร้อยแล้ว');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลงคะแนน');
      },
    }
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="student-graded-score-dialog-title"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="student-graded-score-dialog-title">
        {'ต้องการลงคะแนนให้นักศึกษาใช่หรือไม่?'}
      </DialogTitle>
      <DialogContent>
        <List>
          {studentWithScores &&
            studentWithScores.map(({ student, score }) => {
              return (
                <ListItem
                  key={student.id}
                  secondaryAction={
                    <>
                      <Typography variant="body2" align="right">
                        <b>{score}</b>/{maxPoint}
                      </Typography>
                      {student.scoreInfo && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          align="right"
                        >
                          ก่อนหน้านี้ {student.scoreInfo.score}/{maxPoint}
                        </Typography>
                      )}
                    </>
                  }
                  sx={{
                    '&:not(:last-child)': {
                      mb: 1,
                      borderBottom: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                    },
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      alt={`${student.username}'s profile image`}
                      src={getImagePath(student.profileImage)}
                    >
                      {student.firstName && student.lastName
                        ? student.firstName?.charAt(0) +
                          student.lastName?.charAt(0)
                        : student.username?.charAt(0)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={getStudentName(student)}
                    primaryTypographyProps={{
                      variant: 'subtitle2',
                      style: {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      },
                    }}
                    sx={{ pr: 4 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              );
            })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>ยกเลิก</Button>
        <Button
          onClick={() => mutation.mutate()}
          autoFocus
          color="success"
          sx={{
            fontWeight: 'bold',
          }}
        >
          ลงคะแนน
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentGradedScoreDialog;
