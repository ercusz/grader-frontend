import StudentGradedScoreDialog, {
  openStudentGradedScoreDialogAtom,
} from '@/components/dialogs/student-graded-score/StudentGradedScoreDialog';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useAssignmentSubmissions } from '@/hooks/submission/useSubmission';
import {
  enabledPointDeductionAtom,
  selectedSubmissionsAtom,
} from '@/stores/assignment-submissions';
import { calculateDeductPoint } from '@/utils/SubmissionService';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  Paper,
  Popper,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export interface IFeedbackSubHeader {}

const FeedbackSubHeader: React.FC<IFeedbackSubHeader> = () => {
  const router = useRouter();
  const { slug, assignmentId } = router.query;
  const { data: classroom } = useClassroomSlug({ slug: slug as string });
  const { data: assignment, data: { students } = {} } =
    useAssignmentSubmissions({
      classroomId: classroom?.id.toString() as string,
      assignmentId: assignmentId?.toString() as string,
    });

  const [selected] = useAtom(selectedSubmissionsAtom);
  const [enabledPointDeduction, setEnabledPointDeduction] = useAtom(
    enabledPointDeductionAtom
  );

  const [, openStudentGradedScoreDialog] = useAtom(
    openStudentGradedScoreDialogAtom
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClickPointDeductInfo = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const openPointDeductInfo = Boolean(anchorEl);
  const idPointDeductInfo = openPointDeductInfo
    ? 'point-deduction-info'
    : undefined;

  const createAssignmentFormContext = useForm<{ point: number | null }>({
    defaultValues: {
      point: null,
    },
  });

  const { handleSubmit, watch, formState, register } =
    createAssignmentFormContext;
  const { errors, dirtyFields } = formState;
  const point = watch('point');

  const maxPoint = useMemo(() => {
    return assignment?.point ?? 0;
  }, [assignment]);

  const deductPointCheckLists = {
    enabledPointDeduction: assignment && assignment.enabledPointDeduction,
    selectedStudentsHasSubmitted:
      selected.length > 0 &&
      students &&
      selected.every((id) =>
        students.some((st) => st.id === id && st.submission)
      ),
    validPoint:
      point !== null &&
      point >= 0 &&
      point <= maxPoint &&
      /^[0-9]*(\.[0-9]{0,2})?$/.test(point.toString()),
    greaterThanMinPoint:
      point !== null &&
      assignment &&
      assignment.minPoint !== null &&
      assignment.minPoint !== undefined &&
      point > assignment?.minPoint,
  };

  const canDeductPoint =
    deductPointCheckLists.enabledPointDeduction &&
    deductPointCheckLists.selectedStudentsHasSubmitted &&
    deductPointCheckLists.validPoint &&
    deductPointCheckLists.greaterThanMinPoint;

  useEffect(() => {
    if (!canDeductPoint) {
      setEnabledPointDeduction(false);
    }
  }, [canDeductPoint, setEnabledPointDeduction]);

  const handleSubmitScore = () => {
    openStudentGradedScoreDialog(true);
  };

  const renderDeductPointInfo = () => {
    if (assignment && students && point) {
      const { minPoint, endDate, deductPoint, deductType } = assignment;

      const {
        diff,
        deduct: deducted,
        point: totalScore,
      } = calculateDeductPoint({
        point: point,
        minPoint: minPoint ?? 0,
        dueDate: endDate,
        submittedDate:
          students.find((st) => st.id === selected[0])?.submission?.createdAt ??
          '',
        deductPoint: deductPoint ?? 0,
        deductType: deductType ?? 'day',
      });

      return (
        <Tooltip
          arrow
          title={
            <Stack direction="column" alignItems="center">
              {diff > 0 ? (
                <Typography
                  variant="caption"
                  sx={{
                    whiteSpace: 'pre-line',
                    textAlign: 'center',
                    mb: 1,
                  }}
                >
                  {`หัก ${deductPoint} คะแนน/${
                    deductType === 'hour' ? 'ชั่วโมง' : 'วัน'
                  }
              ส่งงานช้า ${diff} ${deductType === 'hour' ? 'ชั่วโมง' : 'วัน'}
            จะต้องหักคะแนน ${deducted} คะแนน
            แต่คะแนนสุทธิต้องไม่ต่ำกว่า ${minPoint} คะแนน`}
                </Typography>
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    textAlign: 'center',
                    mb: 1,
                  }}
                >
                  ส่งงานตรงเวลา
                </Typography>
              )}
              <Typography variant="body2" sx={{ mb: 1 }}>
                {`ดังนั้นคะแนนสุทธิที่ได้คือ ${totalScore} คะแนน`}
              </Typography>
            </Stack>
          }
        >
          <Typography variant="body2" sx={{ cursor: 'pointer' }}>
            {`เหลือ: ${totalScore}`}
          </Typography>
        </Tooltip>
      );
    }

    return null;
  };

  return (
    <>
      <Popper
        id={idPointDeductInfo}
        open={openPointDeductInfo}
        anchorEl={anchorEl}
        placement="bottom"
        disablePortal
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
        modifiers={[
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
              rootBoundary: 'viewport',
              padding: 8,
            },
          },
        ]}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Paper
          sx={{
            p: 2,
            maxWidth: 400,
            bgcolor: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.primary.contrastText,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-line',
            }}
          >
            {`เงื่อนไขการเปิดใช้งานมีดังนี้
1. เปิดใช้งานฟังก์ชัน 'การหักคะแนนเมื่อส่งงานช้า' ในการตั้งค่างาน ${
              deductPointCheckLists.enabledPointDeduction ? '✅' : '❌'
            }
2. นักศึกษาที่เลือกส่งงานเข้ามาแล้วทุกคน ${
              deductPointCheckLists.selectedStudentsHasSubmitted ? '✅' : '❌'
            }
3. กรอกคะแนนถูกต้อง ${deductPointCheckLists.validPoint ? '✅' : '❌'}
4. คะแนนที่กรอกมาต้องมากกว่าคะแนนขั้นต่ำ ${
              deductPointCheckLists.greaterThanMinPoint ? '✅' : '❌'
            }`}
          </Typography>
        </Paper>
      </Popper>

      {/* Student Graded Score Dialog */}
      {point && selected.length > 0 && (
        <StudentGradedScoreDialog point={point} />
      )}

      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            {selected.length === 0
              ? 'ยังไม่ได้เลือก'
              : `เลือกแล้ว ${selected.length} รายการ`}
          </Typography>
          {errors.point && (
            <Typography variant="caption" color="red">
              {errors.point.message}
            </Typography>
          )}
        </Box>
        <Box sx={{ flexGrow: 0, m: 2 }}>
          <Stack direction="row" spacing={2} alignItems="start">
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="flex-end"
            >
              <TextField
                id="point"
                label="คะแนน"
                size="small"
                autoComplete="off"
                sx={{ mb: 0.2, width: '14ch' }}
                error={errors.point ? true : false}
                disabled={selected.length === 0}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{
                        color:
                          selected.length === 0
                            ? 'text.disabled'
                            : 'text.primary',
                      }}
                    >
                      /{maxPoint}
                    </InputAdornment>
                  ),
                }}
                {...register('point', {
                  required: 'คุณจำเป็นต้องกรอกคะแนน',
                  pattern: {
                    value: /^[0-9]*(\.[0-9]{0,2})?$/,
                    message: 'คุณจำเป็นต้องกรอกคะแนนเป็นตัวเลขเท่านั้น',
                  },
                  min: {
                    value: 0,
                    message: 'คุณจำเป็นต้องกรอกคะแนนมากกว่าหรือเท่ากับ 0 คะแนน',
                  },
                  max: {
                    value: maxPoint,
                    message: `คุณจำเป็นต้องกรอกคะแนนน้อยกว่า ${maxPoint} คะแนน`,
                  },
                })}
              />
              <FormControl
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
              >
                <FormControlLabel
                  label={
                    <Typography
                      variant="caption"
                      color={canDeductPoint ? 'text.primary' : 'text.disabled'}
                    >
                      หักคะแนนส่งงานช้า
                    </Typography>
                  }
                  control={
                    <Checkbox
                      size="small"
                      checked={enabledPointDeduction}
                      onChange={(e) =>
                        setEnabledPointDeduction(e.target.checked)
                      }
                      sx={{ p: 0.4 }}
                    />
                  }
                  disabled={!canDeductPoint}
                  sx={{
                    m: 0,
                  }}
                />
                <IconButton
                  sx={{ p: 0, ml: 0.5 }}
                  onClick={handleClickPointDeductInfo}
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </FormControl>
            </Stack>
            <Stack direction="column">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit(handleSubmitScore)()}
                disabled={
                  Object.keys(dirtyFields).length > 0 && selected.length > 0
                    ? errors.point
                      ? true
                      : false
                    : true
                }
              >
                ยืนยัน
              </Button>
              {enabledPointDeduction &&
                canDeductPoint &&
                selected.length === 1 && (
                  <FormHelperText>{renderDeductPointInfo()}</FormHelperText>
                )}
            </Stack>
          </Stack>
        </Box>
      </Toolbar>
    </>
  );
};

export default FeedbackSubHeader;
