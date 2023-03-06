import FeedbackLayout from '@/components/layouts/feedback/FeedbackLayout';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useAssignmentSubmissions } from '@/hooks/submission/useSubmission';
import { setToken } from '@/utils/APIHelper';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import { getAssignmentSubmissions } from '@/utils/SubmissionService';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CachedIcon from '@mui/icons-material/Cached';
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import '@uiw/react-markdown-preview/markdown.css';
import { format, isAfter, isBefore, isValid, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { VscCode } from 'react-icons/vsc';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
} from 'recharts';
import { NextPageWithLayout } from '../../../../../page';

const AssignmentSubmissions: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const theme = useTheme();
  const { assignmentId } = router.query;
  const { data: classroom } = useClassroomSlug({ slug: slug });
  const {
    isLoading,
    isSuccess,
    data: assignment,
    data: { students } = {},
    dataUpdatedAt,
  } = useAssignmentSubmissions({
    classroomId: classroom?.id.toString() as string,
    assignmentId: assignmentId?.toString() as string,
  });

  const gradingStats = useMemo(() => {
    return {
      notSubmitted: students?.filter(
        (student) => !student.submission && !student.scoreInfo
      ).length,
      submitted: students?.filter(
        (student) => student.submission && !student.scoreInfo
      ).length,
      graded: students?.filter(
        (student) =>
          student.scoreInfo &&
          (!student.submission ||
            (student.submission &&
              !isBefore(
                parseISO(student.scoreInfo.gradedAt),
                parseISO(student.submission.createdAt)
              )))
      ).length,
      resubmitted: students?.filter(
        (student) =>
          student.submission &&
          student.scoreInfo &&
          isBefore(
            parseISO(student.scoreInfo.gradedAt),
            parseISO(student.submission.createdAt)
          )
      ).length,
    };
  }, [students]);

  const chartData = useMemo(() => {
    return [
      {
        name: 'ส่งงานตรงเวลา',
        value:
          students && assignment
            ? students?.filter(({ submission }) =>
                submission
                  ? !isAfter(
                      parseISO(submission.createdAt),
                      parseISO(assignment?.endDate)
                    )
                  : false
              ).length
            : 0,
      },
      {
        name: 'ส่งงานสาย',
        value:
          students && assignment
            ? students?.filter(({ submission }) =>
                submission
                  ? isAfter(
                      parseISO(submission.createdAt),
                      parseISO(assignment?.endDate)
                    )
                  : false
              ).length
            : 0,
      },
      {
        name: 'ยังไม่ส่งงาน',
        value:
          students && classroom
            ? students.filter(({ submission }) => !submission).length
            : 0,
      },
    ];
  }, [students, assignment, classroom]);

  const COLORS = [
    theme.palette.success.light,
    theme.palette.warning.light,
    theme.palette.text.disabled,
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && classroom) {
      return (
        <Box
          className="text-center shadow-xl"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: (theme) => theme.palette.background.default,
            backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.5),
            padding: 1,
            borderRadius: 1,
          }}
        >
          <Typography className="font-bold" variant="body1">
            {`${payload[0].value} คน`}
          </Typography>
          <Typography sx={{ fontSize: '0.8rem' }}>{payload[0].name}</Typography>
          {/* <Typography sx={{ fontSize: '0.6rem' }}>
            {`(${((payload[0].value / classroom.students.length) * 100).toFixed(
              2
            )}%)`}
          </Typography> */}
        </Box>
      );
    }

    return null;
  };

  const [graphStyle, setGraphStyle] = useState(0);

  return (
    <section>
      <Head>
        <title>
          {classroom
            ? `${classroom.course.name} - ${classroom.name}`
            : 'ไม่พบรายวิชา'}
        </title>
      </Head>
      {isLoading && (
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            margin: 'auto',
            padding: 'auto',
          }}
        >
          <CircularProgress color="inherit" />
        </Container>
      )}

      {isSuccess && classroom && students && students.length > 0 && (
        <Grid
          container
          spacing={3}
          sx={{
            '& .MuiPaper-root': {
              borderBottom: (theme) =>
                `1px double ${alpha(theme.palette.text.primary, 0.2)}`,
            },
          }}
        >
          {/* Latest update */}
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              {isValid(dataUpdatedAt)
                ? `อัปเดตล่าสุดเมื่อ ${format(dataUpdatedAt, 'PPp', {
                    locale: th,
                  })}`
                : null}
            </Typography>
          </Grid>
          {/* Assignment name */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Typography
                sx={{
                  fontSize: 100,
                  color: (theme) => alpha(theme.palette.primary.main, 0.1),
                }}
              >
                {assignment.type === 'java-src' && (
                  <VscCode className="absolute -top-8 -right-2 -rotate-12" />
                )}
                {assignment.type === 'docs' && (
                  <AssignmentIcon
                    className="absolute -top-2 -right-2 -rotate-12"
                    fontSize="inherit"
                  />
                )}
              </Typography>
              <Typography component="h2" variant="h6" color="primary">
                {assignment.title}
              </Typography>
              <Typography component="p" variant="caption">
                {assignment.topic?.name}
              </Typography>
            </Paper>
          </Grid>
          {/* Graded Stats */}
          <Grid item xs={12} md={12} lg={6}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                การตรวจ
              </Typography>
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={4}
                  md={6}
                  sx={{
                    color: (theme) => alpha(theme.palette.success.main, 0.8),
                  }}
                >
                  <Typography component="p" variant="h4">
                    {gradingStats.graded}
                  </Typography>
                  <Typography sx={{ flex: 1 }}>ตรวจแล้ว</Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  md={6}
                  sx={{
                    color: (theme) => alpha(theme.palette.warning.main, 0.8),
                  }}
                >
                  <Typography component="p" variant="h4">
                    {gradingStats.submitted}
                  </Typography>
                  <Typography sx={{ flex: 1 }}>รอการตรวจ(ส่งแล้ว)</Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  md={6}
                  sx={{
                    color: (theme) => alpha(theme.palette.info.main, 0.8),
                  }}
                >
                  <Typography component="p" variant="h4">
                    {gradingStats.resubmitted}
                  </Typography>
                  <Typography sx={{ flex: 1 }}>มีการแก้ไข</Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  md={6}
                  sx={{
                    color: (theme) => alpha(theme.palette.error.main, 0.8),
                  }}
                >
                  <Typography component="p" variant="h4">
                    {gradingStats.notSubmitted}
                  </Typography>
                  <Typography sx={{ flex: 1 }}>
                    ยังไม่ตรวจ(ยังไม่ส่ง)
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {/* Chart */}
          <Grid item xs={12} md={12} lg={6}>
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'row',
                height: 240,
              }}
            >
              <Grid container>
                <Grid
                  item
                  xs={0}
                  md={7}
                  sx={{
                    p: 2,
                    display: { xs: 'none', md: 'block' },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      component="h2"
                      variant="h6"
                      color="primary"
                      gutterBottom
                    >
                      การส่งงาน
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setGraphStyle((graphStyle + 1) % 3)}
                    >
                      <CachedIcon />
                    </IconButton>
                  </Stack>
                  {chartData &&
                    chartData.length > 0 &&
                    chartData.map((data, index) => {
                      return (
                        <Stack
                          key={data.name}
                          direction="row"
                          alignItems="center"
                          spacing={1}
                        >
                          <Box
                            component="span"
                            sx={{
                              width: 20,
                              height: 4,
                              bgcolor: COLORS[index % COLORS.length],
                              borderRadius: 1,
                            }}
                          >
                            &nbsp;
                          </Box>
                          <Typography variant="subtitle1">
                            {data.name}
                          </Typography>
                        </Stack>
                      );
                    })}
                </Grid>
                <Grid item xs={12} md={5}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{
                      p: 2,
                      display: { xs: 'flex', md: 'none' },
                    }}
                  >
                    <Typography
                      component="h2"
                      variant="h6"
                      color="primary"
                      gutterBottom
                    >
                      การส่งงาน
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setGraphStyle((graphStyle + 1) % 3)}
                    >
                      <CachedIcon />
                    </IconButton>
                  </Stack>

                  <Box sx={{ height: { xs: 120, md: 240 }, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          <filter id="textPencil">
                            <feTurbulence baseFrequency="0.02" />
                            <feDisplacementMap in="SourceGraphic" scale="10" />
                          </filter>
                          <filter id="pencil">
                            <feTurbulence baseFrequency="0.035" />
                            <feDisplacementMap in="SourceGraphic" scale="10" />
                          </filter>
                          {chartData.map((data, index) => {
                            return (
                              <pattern
                                key={`pattern${index}`}
                                id={`pattern${index}`}
                                width="1"
                                height="4"
                                patternUnits="userSpaceOnUse"
                                patternTransform="rotate(45)"
                              >
                                <line
                                  x1="0"
                                  x2="100%"
                                  y1="0"
                                  y2="0"
                                  strokeWidth="4"
                                  stroke={COLORS[index % COLORS.length]}
                                />
                              </pattern>
                            );
                          })}
                        </defs>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={60}
                          dataKey="value"
                          labelLine={false}
                          label={({ cx, cy }) => {
                            const styles = [
                              {},
                              {
                                filter: `drop-shadow(0 1px 1px rgb(0 0 0 / 0.5))`,
                              },
                              {
                                fontFamily: 'Comic Sans MS, cursive',
                                filter: 'url(#textPencil)',
                              },
                            ];

                            return (
                              <text
                                x={cx}
                                y={cy}
                                dy={8}
                                textAnchor="middle"
                                fill={theme.palette.primary.main}
                                style={styles[graphStyle]}
                              >
                                <tspan x={cx} dy="-0.2em" fontSize="2em">
                                  {(gradingStats.graded ?? 0) +
                                    (gradingStats.submitted ?? 0)}
                                </tspan>
                                <tspan x={cx} dy="1.2em">
                                  from
                                </tspan>
                                <tspan x={cx} dy="1.2em">
                                  {classroom.students.length}
                                </tspan>
                              </text>
                            );
                          }}
                        >
                          {chartData.map((entry, index) => {
                            const styles = [
                              {
                                fill: COLORS[index % COLORS.length],
                                stroke: 'none',
                              },
                              {
                                fill: COLORS[index % COLORS.length],
                                stroke: 'none',
                                filter: `drop-shadow(0px 0px 2px ${
                                  COLORS[index % COLORS.length]
                                }`,
                              },
                              {
                                fill: `url(#pattern${index})`,
                                stroke: theme.palette.primary.main,
                                strokeWidth: 2,
                                filter: 'url(#pencil)',
                              },
                            ];
                            return (
                              <Cell
                                key={`cell-${index}`}
                                style={styles[graphStyle]}
                              />
                            );
                          })}
                        </Pie>
                        <ChartTooltip
                          content={<CustomTooltip />}
                          wrapperStyle={{ outline: 'none' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {isSuccess && students && students.length === 0 && (
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h6" align="center">
              ไม่พบงานที่ส่ง
            </Typography>
          </Grid>
        </Grid>
      )}
    </section>
  );
};

export default AssignmentSubmissions;

AssignmentSubmissions.getLayout = (page) => {
  const { props } = page;
  const { slug, feedbackHeaderProps, contentProps } = props;
  return (
    <FeedbackLayout
      classroomSlug={slug}
      feedbackHeaderProps={feedbackHeaderProps}
      contentProps={contentProps}
    >
      {page}
    </FeedbackLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug, assignmentId }: any = context.params;
  const { req } = context;
  const token = await getToken({ req });

  if (token && token.jwt) {
    setToken(token.jwt);
  }

  const queryClient = new QueryClient();

  try {
    const classroom = await queryClient.fetchQuery(
      ['classroom', { slug: slug }],
      () => getClassroomBySlug(slug)
    );

    const assignmentSubmissions = await queryClient.fetchQuery(
      ['submissions', { assignmentId: assignmentId }],
      () => getAssignmentSubmissions(assignmentId, classroom.id.toString())
    );

    if (!assignmentSubmissions) {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug: slug,
      feedbackHeaderProps: {
        backButton: true,
        downloadCurrentAssignmentButton: true,
      },
      contentProps: {
        subHeader: true,
        sidebar: true,
      },
      dehydratedState: dehydrate(queryClient),
    },
  };
};
