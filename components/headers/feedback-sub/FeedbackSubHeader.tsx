import {
  enabledPointDeductionAtom,
  selectedSubmissionsAtom,
} from '@/stores/assignment-submissions';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';

export interface IFeedbackSubHeader {}

const FeedbackSubHeader: React.FC<IFeedbackSubHeader> = () => {
  const [selected] = useAtom(selectedSubmissionsAtom);
  const [enabledPointDeduction, setEnabledPointDeduction] = useAtom(
    enabledPointDeductionAtom
  );

  const createAssignmentFormContext = useForm<{ point: number | null }>({
    defaultValues: {
      point: null,
    },
  });

  const { handleSubmit, watch, formState, reset, register } =
    createAssignmentFormContext;
  const { errors, dirtyFields } = formState;

  const maxPoint = 40;

  const onSubmit = () => {
    alert(watch('point'));
    alert(JSON.stringify(selected));
    alert(JSON.stringify(enabledPointDeduction));
  };

  return (
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
              sx={{ mb: 0.2, width: '12ch' }}
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
                  value: /^[0-9]*$/,
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
            <FormControlLabel
              label={
                <Typography
                  variant="caption"
                  color={
                    selected.length === 0 ? 'text.disabled' : 'text.primary'
                  }
                >
                  หักคะแนนส่งงานช้า
                </Typography>
              }
              control={
                <Checkbox
                  size="small"
                  checked={enabledPointDeduction}
                  onChange={(e) => setEnabledPointDeduction(e.target.checked)}
                  sx={{ p: 0.4 }}
                />
              }
              disabled={selected.length === 0}
              sx={{
                m: 0,
              }}
            />
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmit(onSubmit)()}
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
        </Stack>
      </Box>
    </Toolbar>
  );
};

export default FeedbackSubHeader;
