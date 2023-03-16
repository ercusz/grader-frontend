import { CreateAssignmentFormValues } from '@/components/dialogs/create-assignment/CreateAssignmentDialog';
import MarkdownEditor from '@/components/editors/markdown/MarkdownEditor';
import TestCasesList from '@/components/lists/testcases-list/TestCasesList';
import { GraderConfig } from '@/constants/grader';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import {
  Alert,
  Divider,
  InputAdornment,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { atom, useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  DateTimePickerElement,
  FormContainer,
  TextFieldElement,
} from 'react-hook-form-mui';

export interface ICreateAssignmentForm {
  formContext: UseFormReturn<CreateAssignmentFormValues, any>;
}

export const postDateTypeAtom = atom('now');
export const problemTypeAtom = atom('java-src');
export const enabledPointDeductionAtom = atom(false);
export const deductTypeAtom = atom<'day' | 'hour'>('day');

const CreateAssignmentForm: React.FC<ICreateAssignmentForm> = ({
  formContext,
}) => {
  const [problemType, setProblemType] = useAtom(problemTypeAtom);
  const [postDateType, setPostDateType] = useAtom(postDateTypeAtom);
  const [enabledPointDeduction, setEnabledPointDeduction] = useAtom(
    enabledPointDeductionAtom
  );
  const [deductType, setDeductType] = useAtom(deductTypeAtom);
  const currentDateTime = useMemo(() => new Date(), []);
  const { watch, setValue } = formContext;
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const deductPoint = watch('deductPoint');
  const minPoint = watch('minPoint');
  const point = watch('point');

  useEffect(() => {
    if (postDateType === 'now') {
      setValue('startDate', currentDateTime);
    }
  }, [currentDateTime, postDateType, setValue]);

  const handleProblemType = (
    event: React.MouseEvent<HTMLElement>,
    newType: string
  ) => {
    if (newType !== null) {
      setProblemType(newType);
    }
  };

  const handlePostDateType = (
    event: React.MouseEvent<HTMLElement>,
    newType: string
  ) => {
    if (newType !== null) {
      setPostDateType(newType);
    }
  };

  const handleIsDeductPoint = (
    event: React.MouseEvent<HTMLElement>,
    newType: boolean
  ) => {
    if (newType !== null) {
      setEnabledPointDeduction(newType);
    }
  };

  const handleDeductType = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'day' | 'hour'
  ) => {
    if (newType !== null) {
      setDeductType(newType);
    }
  };

  const isRenderDeductPoint =
    enabledPointDeduction && endDate && deductPoint && Number(minPoint) > -1;

  return (
    <>
      <FormContainer formContext={formContext}>
        <Stack
          sx={{ pt: 2 }}
          direction="column"
          spacing={2}
          justifyContent="center"
        >
          <TextFieldElement
            fullWidth
            label="ชื่องาน"
            name="title"
            validation={{
              required: {
                value: true,
                message: 'คุณจำเป็นต้องกรอก ชื่องาน',
              },
            }}
          />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="body2">วันเวลาโพสต์</Typography>
            <ToggleButtonGroup
              value={postDateType}
              exclusive
              size="small"
              onChange={handlePostDateType}
              aria-label="วันเวลาโพสต์"
              sx={{
                alignItems: 'center',
              }}
            >
              <ToggleButton value="now" aria-label="เดี๋ยวนี้">
                <Tooltip title="โพสต์จะปรากฏทันที">
                  <Typography variant="body2">เดี๋ยวนี้</Typography>
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="custom" aria-label="กำหนดเอง">
                <Tooltip title="โพสต์จะปรากฏเมื่อถึงเวลาที่กำหนดไว้">
                  <Typography variant="body2">กำหนดเอง</Typography>
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Stack direction="row" spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePickerElement
                className="w-full"
                label="วันเวลาที่โพสต์จะปรากฏ"
                name="startDate"
                required
                validation={{
                  required: 'กรุณาระบุวันเวลาที่เริ่มการส่งงาน',
                }}
                minDate={currentDateTime}
                disabled={postDateType === 'now'}
              />
              <DateTimePickerElement
                className="w-full"
                label="วันเวลาที่ครบกำหนดส่งงาน"
                name="endDate"
                required
                validation={{
                  required: 'กรุณาระบุวันเวลาที่สิ้นสุดการส่งงาน',
                  validate: (value) => {
                    let threeMinLater = new Date(
                      (startDate?.getTime() ?? new Date().getTime()) + 3 * 60000
                    );
                    if (value < threeMinLater) {
                      return 'วันเวลาที่สิ้นสุดการส่งงานต้องมากกว่าวันเวลาที่เริ่มการส่งงานอย่างต่ำ 3 นาที';
                    }
                    return true;
                  },
                }}
                minDateTime={
                  new Date(
                    (startDate?.getTime() ?? new Date().getTime()) + 3 * 60000
                  )
                } // 3 minutes after start date
              />
            </LocalizationProvider>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2">การหักคะแนนเมื่อส่งงานช้า</Typography>
              <ToggleButtonGroup
                value={enabledPointDeduction}
                exclusive
                size="small"
                onChange={handleIsDeductPoint}
                aria-label="การหักคะแนนเมื่อส่งงานช้า"
                sx={{
                  alignItems: 'center',
                }}
              >
                <ToggleButton value={false} aria-label="ไม่หักคะแนน">
                  <Tooltip title="เมื่อนักศึกษาส่งงานช้ากว่ากำหนด จะไม่ถูกหักคะแนน">
                    <Typography variant="body2">ไม่หักคะแนน</Typography>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value={true} aria-label="หักคะแนน">
                  <Tooltip title="เมื่อนักศึกษาส่งงานช้ากว่ากำหนด จะถูกหักคะแนนตามค่าที่กำหนด">
                    <Typography variant="body2">หักคะแนน</Typography>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            {enabledPointDeduction && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <ToggleButtonGroup
                  value={deductType}
                  exclusive
                  size="small"
                  onChange={handleDeductType}
                  aria-label="ประเภทการหักคะแนน"
                  sx={{
                    alignItems: 'center',
                  }}
                >
                  <ToggleButton value="day" aria-label="รายวัน">
                    <Tooltip title="คะแนนจะถูกหักรายวัน">
                      <Typography variant="body2">รายวัน</Typography>
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="hour" aria-label="รายชั่วโมง">
                    <Tooltip title="คะแนนจะถูกหักรายชั่วโมง">
                      <Typography variant="body2">รายชั่วโมง</Typography>
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            )}
          </Stack>
          {enabledPointDeduction && (
            <>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextFieldElement
                  name="deductPoint"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">หักคะแนน</InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">{`คะแนน/${
                        (deductType === 'day' && 'วัน') ||
                        (deductType === 'hour' && 'ชั่วโมง')
                      }`}</InputAdornment>
                    ),
                  }}
                  sx={{
                    '& input': {
                      textAlign: 'center',
                    },
                  }}
                />
                <TextFieldElement
                  name="minPoint"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        จนกว่าคะแนนจะเหลือ
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">คะแนน</InputAdornment>
                    ),
                  }}
                  validation={{
                    min: {
                      value: 0,
                      message: 'คะแนนต่ำสุดต้องมากกว่า 0',
                    },
                    max: {
                      value: point,
                      message: 'คะแนนต่ำสุดต้องไม่เกินคะแนนเต็ม',
                    },
                  }}
                  sx={{
                    '& input': {
                      textAlign: 'center',
                    },
                  }}
                />
              </Stack>
              {isRenderDeductPoint && (
                <Alert severity="info">
                  {`หากนักศึกษาส่งงานช้ากว่า ${format(endDate, 'PPPPp', {
                    locale: th,
                  })}\nนักศึกษาจะถูกหักคะแนนงาน${
                    (deductType === 'day' && 'วัน') ||
                    (deductType === 'hour' && 'ชั่วโมง')
                  }ละ ${deductPoint} คะแนน\nแต่นักศึกษาจะได้คะแนนไม่ต่ำกว่า ${minPoint} คะแนน`}
                </Alert>
              )}
            </>
          )}
          <Stack direction="row" alignItems="center">
            <Typography variant="body2" sx={{ mr: 2 }}>
              ประเภทไฟล์ที่ยอมรับ
            </Typography>
            <ToggleButtonGroup
              value={problemType}
              exclusive
              size="small"
              onChange={handleProblemType}
              aria-label="ประเภทไฟล์ที่ยอมรับ"
              sx={{
                alignItems: 'center',
              }}
            >
              <ToggleButton value="java-src" aria-label="ซอร์สโค้ดภาษา Java">
                <Tooltip title="ซอร์สโค้ดภาษา Java">
                  <CodeIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="docs" aria-label="ไฟล์เอกสาร หรือรูปภาพ">
                <Tooltip title="ไฟล์เอกสาร หรือรูปภาพ">
                  <DescriptionIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          {problemType === 'java-src' && (
            <>
              <Typography variant="caption" sx={{ mt: 2 }}>
                นักศึกษาในคลาสเรียนจะสามารถส่งได้เพียงซอร์สโค้ดภาษา Java
                เท่านั้น
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextFieldElement
                  fullWidth
                  label="Time Limit (วินาที)"
                  name="timeLimit"
                  validation={{
                    pattern: {
                      value: /^[0-9]{1,2}$/,
                      message: 'คุณจำเป็นต้องกรอกตัวเลขไม่เกิน 2 หลักเท่านั้น',
                    },
                    min: {
                      value: GraderConfig.MIN_TIME_LIMIT,
                      message: 'คุณจำเป็นต้องกรอก Time Limit มากกว่า 0 วินาที',
                    },
                    max: {
                      value: GraderConfig.MAX_TIME_LIMIT,
                      message:
                        'คุณจำเป็นต้องกรอก Time Limit น้อยกว่า 10 วินาที',
                    },
                  }}
                />
                <TextFieldElement
                  fullWidth
                  label="Memory Limit (กิโลไบต์)"
                  name="memoryLimit"
                  validation={{
                    pattern: {
                      value: /^[0-9]{1,6}$/,
                      message: 'คุณจำเป็นต้องกรอกตัวเลขไม่เกิน 6 หลักเท่านั้น',
                    },
                    min: {
                      value: GraderConfig.MIN_MEMORY_LIMIT,
                      message:
                        'คุณจำเป็นต้องกรอก Memory Limit มากกว่า 0 กิโลไบต์',
                    },
                    max: {
                      value: GraderConfig.MAX_MEMORY_LIMIT,
                      message:
                        'คุณจำเป็นต้องกรอก Memory Limit น้อยกว่า 100000 กิโลไบต์',
                    },
                  }}
                />
              </Stack>
              <Typography variant="caption" sx={{ mt: 2 }}>
                💡 TIPS: หากไม่กรอก Time Limit / Memory Limit
                จะใช้ค่าเริ่มต้นของระบบ
              </Typography>
              <TestCasesList />
            </>
          )}
          {problemType === 'docs' && (
            <Typography variant="caption" sx={{ mt: 2 }}>
              นักศึกษาในคลาสเรียนจะสามารถส่งได้เพียงไฟล์เอกสาร
              หรือรูปภาพเท่านั้น
            </Typography>
          )}
        </Stack>
        <Divider light sx={{ my: 2 }} />
        <Typography variant="h6" component="h2" sx={{ paddingTop: 2 }}>
          เนื้อหา
        </Typography>
        <MarkdownEditor />
      </FormContainer>
    </>
  );
};

export default CreateAssignmentForm;
