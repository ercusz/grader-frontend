import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AddStudentForm from '@/components/forms/add-student-form/AddStudentForm';
import AddSectionForm from '@/components/forms/add-section-form/AddSectionForm';
import CreateCourseForm from '@/components/forms/create-course-form/CreateCourseForm';
import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import { CourseDetail, CreateCourseClassroom } from '@/types/types';
import { mainHttpClient, Response } from '@/utils/APIHelper';
import { NextPageWithLayout } from '../page';

const CreateCourse: NextPageWithLayout = ({
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [activeStep, setActiveStep] = useState(0);
  const [course, setCourse] = useState<CourseDetail>({
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
    const { res, err }: Response = await mainHttpClient.post(
      '/api/course/create',
      { ...course, teacherId: userId, classrooms: classrooms }
    );

    if (err) {
      alert(err);
      console.log(err);
      return;
    }

    console.log('Response=', res);
    handleNext();
  };

  const courseFormContext = useForm<CourseDetail>({
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
      form: <AddSectionForm formContext={sectionFormContext} />,
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
                <CheckCircleIcon
                  color="success"
                  sx={{ pr: 0.5 }}
                  fontSize="large"
                />
                <Typography className="font-bold" variant="h6">
                  เพิ่มรายวิชาสำเร็จ
                </Typography>
              </Stack>
              {/* <pre>
                {JSON.stringify(
                  { ...course, teacherId: userId, classrooms: classrooms },
                  null,
                  4
                )}
              </pre>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                รีเซ็ต
              </Button> */}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session?.user.role.name !== 'Teacher') {
    return {
      redirect: {
        destination: '/classroom',
        permanent: true,
      },
    };
  }
  return {
    props: {
      userId: session.user.id,
    },
  };
};
