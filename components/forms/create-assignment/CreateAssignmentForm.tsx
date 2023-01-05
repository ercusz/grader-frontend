import MarkdownEditor from '@/components/editors/markdown/MarkdownEditor';
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
  formContext: UseFormReturn<
    {
      title: string;
    },
    any
  >;
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
            <ToggleButton value="java-src" aria-label="left aligned">
              <Tooltip title="ซอร์สโค้ดภาษา Java">
                <CodeIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="docs" aria-label="centered">
              <Tooltip title="ไฟล์เอกสาร หรือรูปภาพ">
                <DescriptionIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
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
