import AddClassroomForm from '@/components/forms/add-classroom/AddClassroomForm';
import AddStudentForm from '@/components/forms/add-student-form/AddStudentForm';
import { useCourseSlug } from '@/states/courses/useCourses';
import { openAddClassroomsDialogAtom } from '@/stores/add-classrooms';
import { CreateCourseClassroom } from '@/types/types';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { atom, useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export interface IAddClassroomDialog {
  courseSlug: string;
}

const activeStepAtom = atom(0);
export const unsavedChangesAtom = atom(false);

const AddClassroomDialog: React.FC<IAddClassroomDialog> = ({ courseSlug }) => {
  const { data: course } = useCourseSlug({ slug: courseSlug });
  const [openDialog, setOpenDialog] = useAtom(openAddClassroomsDialogAtom);
  const [activeStep, setActiveStep] = useAtom(activeStepAtom);
  const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom);
  const [classrooms, setClassrooms] = useState<CreateCourseClassroom[]>([]);

  const currentClassrooms = useMemo(() => {
    const classroomArr = course
      ? course.classrooms?.flatMap(({ name }) => (name ? name : []))
      : [];
    return classroomArr;
  }, [course]);

  const openUnsavedChangesDialog = (callback: () => void) => {
    if (unsavedChanges) {
      if (
        !confirm(
          'ข้อมูลที่คุณได้แก้ไขยังไม่ถูกบันทึก \nคุณต้องการออกจากหน้านี้ใช่หรือไม่?'
        )
      ) {
        return;
      }

      setClassrooms([]);
      reset({ classrooms: [] });
      setUnsavedChanges(false);
    }

    callback();
  };

  useEffect(() => {
    if (classrooms.length > 0) {
      setUnsavedChanges(true);
    }
  }, [classrooms, setUnsavedChanges]);

  const handleCloseDialog = () => {
    openUnsavedChangesDialog(() => {
      setOpenDialog(false);
      setActiveStep(0);
    });
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSaveChanges = () => {
    alert(JSON.stringify(classrooms, null, 4));
  };

  const classroomsFormContext = useForm<{ classrooms: string[] }>({
    defaultValues: {
      classrooms: [],
    },
  });

  const { handleSubmit: handleAddClassroomSubmit, reset } =
    classroomsFormContext;

  const onSubmitAddClassroom = (data: any) => {
    const cls = data.classrooms;
    setClassrooms(cls.map((d: string) => ({ name: d, students: [] })));
    handleNext();
  };

  const renderCurrentClassrooms = course?.classrooms?.map(({ name }) => (
    <Chip key={name} label={name} size="small" color="success" sx={{ ml: 1 }} />
  ));

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="add-classroom-dialog"
      sx={{
        borderRadius: '20px',
      }}
    >
      <DialogTitle id="add-classroom-dialog">
        {`เพิ่มกลุ่มการเรียน`}
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
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
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>เพิ่มกลุ่มการเรียน</StepLabel>
              <StepContent TransitionProps={{ unmountOnExit: false }}>
                <Typography component="div" variant="body2" gutterBottom>
                  กลุ่มการเรียนปัจจุบัน:
                  {renderCurrentClassrooms}
                </Typography>
                <AddClassroomForm
                  formContext={classroomsFormContext}
                  currentClassrooms={currentClassrooms}
                />
                <Button
                  variant="contained"
                  onClick={() =>
                    handleAddClassroomSubmit((d) => onSubmitAddClassroom(d))()
                  }
                  sx={{ my: 3, mr: 2 }}
                >
                  ถัดไป
                </Button>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>เพิ่มนักศึกษา</StepLabel>
              <StepContent TransitionProps={{ unmountOnExit: false }}>
                <AddStudentForm
                  classrooms={classrooms}
                  setClassrooms={setClassrooms}
                />
                <Button
                  variant="contained"
                  disabled={classrooms.length < 1}
                  onClick={() => handleSaveChanges()}
                  sx={{ my: 3, mr: 2 }}
                >
                  เพิ่มกลุ่มการเรียน
                </Button>
                <Button variant="outlined" onClick={handleBack} sx={{ my: 3 }}>
                  ย้อนกลับ
                </Button>
                <Typography component="div" variant="caption" sx={{ mb: 1 }}>
                  💡 TIPS: คุณสามารถนักศึกษาได้ในภายหลัง
                </Typography>
              </StepContent>
            </Step>
          </Stepper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassroomDialog;
