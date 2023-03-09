import { CreateMaterialFormValues } from '@/components/dialogs/create-material/CreateMaterialDialog';
import MarkdownEditor from '@/components/editors/markdown/MarkdownEditor';
import { filesAtom } from '@/stores/create-material';
import {
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { atom, useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  DateTimePickerElement,
  FormContainer,
  TextFieldElement,
} from 'react-hook-form-mui';
import UploadFileForm from '../upload-file/UploadFileForm';

export interface ICreateMaterialForm {
  formContext: UseFormReturn<CreateMaterialFormValues, any>;
}

export const postDateTypeAtom = atom('now');

const CreateMaterialForm: React.FC<ICreateMaterialForm> = ({ formContext }) => {
  const [postDateType, setPostDateType] = useAtom(postDateTypeAtom);
  const currentDateTime = useMemo(() => new Date(), []);
  const { setValue } = formContext;

  useEffect(() => {
    if (postDateType === 'now') {
      setValue('publishedDate', currentDateTime);
    }
  }, [currentDateTime, postDateType, setValue]);

  const handlePostDateType = (
    event: React.MouseEvent<HTMLElement>,
    newType: string
  ) => {
    if (newType !== null) {
      setPostDateType(newType);
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
            label="ชื่อเอกสาร"
            name="title"
            validation={{
              required: {
                value: true,
                message: 'คุณจำเป็นต้องกรอก ชื่อเอกสาร',
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
                name="publishedDate"
                required
                validation={{
                  required: 'กรุณาระบุวันเวลาที่โพสต์จะปรากฏ',
                }}
                minDate={currentDateTime}
                disabled={postDateType === 'now'}
              />
            </LocalizationProvider>
          </Stack>
          <UploadFileForm filesAtom={filesAtom} />
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

export default CreateMaterialForm;
