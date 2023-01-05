import { CreateAssignmentFormValues } from '@/components/dialogs/create-assignment/CreateAssignmentDialog';
import MarkdownEditor from '@/components/editors/markdown/MarkdownEditor';
import { GraderConfig } from '@/constants/grader';
import { problemTypeAtom } from '@/stores/create-assignment';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import {
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAtom } from 'jotai';
import {
  FormContainer,
  TextFieldElement,
  UseFormReturn,
} from 'react-hook-form-mui';

export interface ICreateAssignmentForm {
  formContext: UseFormReturn<CreateAssignmentFormValues, any>;
}

const CreateAssignmentForm: React.FC<ICreateAssignmentForm> = ({
  formContext,
}) => {
  const [problemType, setProblemType] = useAtom(problemTypeAtom);

  const handleProblemType = (
    event: React.MouseEvent<HTMLElement>,
    newType: string
  ) => {
    if (newType !== null) {
      setProblemType(newType);
    }
  };

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
            label="หัวข้อ"
            name="title"
            validation={{
              required: {
                value: true,
                message: 'คุณจำเป็นต้องกรอก หัวข้อ',
              },
            }}
          />
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
