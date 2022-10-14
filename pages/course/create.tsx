import AddClassroomForm from '@/components/forms/add-classroom/AddClassroomForm';
import AddStudentForm from '@/components/forms/add-student-form/AddStudentForm';
import CreateCourseForm from '@/components/forms/create-course-form/CreateCourseForm';
import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import { useUser } from '@/states/user/useUser';
import { CreateCourseClassroom, CreateCourseReq } from '@/types/types';
import { createCourse } from '@/utils/ClassroomService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NextPageWithLayout } from '../page';

const CreateCourse: NextPageWithLayout = () => {
  const { data: user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.role.name === 'Student') {
      router.push('/classroom');
    }
  }, [user, router]);

  const [activeStep, setActiveStep] = useState(0);
  const [isError, setIsError] = useState(false);
  const [course, setCourse] = useState<CreateCourseReq>({
    name: '',
    code: '',
    semester: 1,
    year: 2565,
  });
  const [classrooms, setClassrooms] = useState<CreateCourseClassroom[]>([]);

  const isStepOptional = (step: number) => {
    return steps[step]?.isOptional;
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const onSubmitCourseDetail = (data: any) => {
    setCourse((prevState) => ({
      ...prevState,
      ...data,
      semester: parseInt(data.semester),
      year: parseInt(data.year),
    }));
    handleNext();
  };

  const onSubmitAddSection = (data: any) => {
    const cls = data.classrooms;
    setClassrooms(cls.map((d: string) => ({ name: d, students: [] })));
    handleNext();
  };

  const handleCreateCourse = async () => {
    const res = await createCourse({ ...course, classrooms: classrooms });

    if (!res) {
      setIsError(true);
    }

    handleNext();
  };

  const courseFormContext = useForm<CreateCourseReq>({
    defaultValues: {},
  });

  const sectionFormContext = useForm<{ classrooms: string[] }>({
    defaultValues: {
      classrooms: [],
    },
  });

  const { handleSubmit: submitCourse } = courseFormContext;
  const { handleSubmit: submitSection } = sectionFormContext;

  const steps = [
    {
      name: 'กรอกข้อมูลรายวิชาเบื้องต้น',
      isOptional: false,
      form: <CreateCourseForm formContext={courseFormContext} />,
      handleSubmit: submitCourse,
      onSubmit: onSubmitCourseDetail,
    },
    {
      name: 'เพิ่มกลุ่มการเรียน',
      isOptional: true,
      form: <AddClassroomForm formContext={sectionFormContext} />,
      handleSubmit: submitSection,
      onSubmit: onSubmitAddSection,
    },
    {
      name: 'เพิ่มนักศึกษา',
      isOptional: true,
      form: (
        <AddStudentForm classrooms={classrooms} setClassrooms={setClassrooms} />
      ),
    },
  ];

  return (
    <section>
      <Grid className="min-h-screen" container>
        <Grid
          item
          xs={false}
          sm={false}
          md={6}
          sx={{
            backgroundImage: 'url(/classroom.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', sm: 'none', md: 'block' },
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }}
        />
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          pb={4}
          px={4}
          pt={10}
          alignItems="center"
          justifyContent="flex-start"
          justifyItems="center"
          maxWidth="sm"
        >
          <Typography
            className="font-bold"
            variant="h4"
            textAlign="center"
            gutterBottom
          >
            เพิ่มรายวิชาใหม่
          </Typography>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.name}>
                <StepLabel
                  optional={
                    isStepOptional(index) ? (
                      <Typography variant="caption">(Optional)</Typography>
                    ) : null
                  }
                >
                  {step.name}
                </StepLabel>
                <StepContent TransitionProps={{ unmountOnExit: false }}>
                  <Typography variant="caption" sx={{ mt: 2, mb: 1 }}>
                    {isStepOptional(activeStep)
                      ? `💡 TIPS: คุณสามารถ${steps[activeStep].name}ได้ในภายหลัง`
                      : ''}
                  </Typography>
                  {step.form}
                  <Box sx={{ mb: 2 }}>
                    <div>
                      {index === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          onClick={() => handleCreateCourse()}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          สร้างรายวิชา
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={() =>
                            step.handleSubmit !== undefined &&
                            step.onSubmit !== undefined
                              ? step.handleSubmit((d) => step.onSubmit(d))()
                              : handleNext()
                          }
                          sx={{ mt: 1, mr: 1 }}
                        >
                          ถัดไป
                        </Button>
                      )}

                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        ย้อนกลับ
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper
              square
              elevation={0}
              sx={{ p: 3, maxHeight: 200, overflow: 'auto' }}
            >
              <Stack direction="row" sx={{ py: 2 }} alignItems="center">
                {isError ? (
                  <>
                    <ClearIcon
                      color="error"
                      sx={{ pr: 0.5 }}
                      fontSize="large"
                    />
                    <Typography className="font-bold" variant="h6">
                      เกิดข้อผิดพลาดในการเพิ่มรายวิชา
                    </Typography>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon
                      color="success"
                      sx={{ pr: 0.5 }}
                      fontSize="large"
                    />
                    <Typography className="font-bold" variant="h6">
                      เพิ่มรายวิชาสำเร็จ
                    </Typography>
                  </>
                )}
              </Stack>
              <Link href="/classroom">
                <Button variant="contained" sx={{ mt: 1, mr: 1 }}>
                  คลาสเรียนของฉัน
                </Button>
              </Link>
            </Paper>
          )}
        </Grid>
      </Grid>
    </section>
  );
};

export default CreateCourse;

CreateCourse.getLayout = (page) => {
  return <PrimaryLayout title="เพิ่มรายวิชาใหม่">{page}</PrimaryLayout>;
};
