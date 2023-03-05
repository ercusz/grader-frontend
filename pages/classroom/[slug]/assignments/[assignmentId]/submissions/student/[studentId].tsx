import FeedbackLayout from '@/components/layouts/feedback/FeedbackLayout';
import AssignmentCommentsSection from '@/components/sections/assignment-comments/AssignmentCommentsSection';
import SourceCodeSection from '@/components/sections/source-code/SourceCodeSection';
import SubmissionTestcasesSection from '@/components/sections/submission-testcases/SubmissionTestcasesSection';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useAssignmentSubmissions } from '@/hooks/submission/useSubmission';
import { UserResponse } from '@/types/types';
import { setToken } from '@/utils/APIHelper';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import { getImagePath } from '@/utils/imagePath';
import { getAssignmentSubmissions } from '@/utils/SubmissionService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Avatar,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import '@uiw/react-markdown-preview/markdown.css';
import {
  format,
  formatDistance,
  isAfter,
  isBefore,
  isValid,
  parseISO,
} from 'date-fns';
import { th } from 'date-fns/locale';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { NextPageWithLayout } from '../../../../../../page';

const AssignmentSubmission: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { assignmentId, studentId } = router.query;
  const { data: classroom } = useClassroomSlug({ slug: slug });
  const {
    isLoading,
    isSuccess,
    data: assignment,
    data: { students } = {},
  } = useAssignmentSubmissions({
    classroomId: classroom?.id.toString() as string,
    assignmentId: assignmentId?.toString() as string,
  });

  const student = useMemo(() => {
    if (students && studentId) {
      return students.find((s) => s.id === Number(studentId));
    }
  }, [students, studentId]);

  const getStudentName = (student: UserResponse) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }

    return student.username;
  };

  const [openCommentsSection, setOpenCommentsSection] = useState(false);

  const handleOpenCommentsSection = () => {
    setOpenCommentsSection(!openCommentsSection);
  };

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

      {isSuccess && student && (
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
          {/* Submission Info */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Avatar
                  alt={`${student.username}'s profile image`}
                  src={getImagePath(student.profileImage)}
                >
                  {student.firstName && student.lastName
                    ? student.firstName?.charAt(0) + student.lastName?.charAt(0)
                    : student.username?.charAt(0)}
                </Avatar>
                <Stack
                  direction="column"
                  sx={{
                    width: '100%',
                    overflow: 'hidden',
                    '& .MuiTypography-root': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                  }}
                >
                  <Typography
                    component="h2"
                    variant="h6"
                    color="primary"
                    noWrap
                  >
                    {getStudentName(student)}
                  </Typography>
                  {student.submission &&
                    isValid(parseISO(student.submission.createdAt)) && (
                      <>
                        <Typography variant="caption" noWrap>
                          ส่งเมื่อ{' '}
                          {format(
                            parseISO(student.submission.createdAt),
                            'PPp',
                            {
                              locale: th,
                            }
                          )}
                        </Typography>
                        {isAfter(
                          parseISO(student.submission.createdAt),
                          parseISO(assignment.endDate)
                        ) && (
                          <Typography variant="caption" color="error" noWrap>
                            ส่งช้า{' '}
                            {formatDistance(
                              parseISO(student.submission.createdAt),
                              parseISO(assignment.endDate),
                              {
                                locale: th,
                              }
                            )}
                          </Typography>
                        )}
                      </>
                    )}
                </Stack>
                <Stack direction="column" alignItems="flex-end">
                  <Stack direction="row" alignItems="flex-end">
                    <Typography variant="h4" color="primary">
                      {student.scoreInfo?.score ?? 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      /{assignment.point}
                    </Typography>
                  </Stack>
                  {student.submission ? (
                    student.scoreInfo ? (
                      !isBefore(
                        parseISO(student.scoreInfo.gradedAt),
                        parseISO(student.submission.createdAt)
                      ) ? (
                        <Stack direction="column" alignItems="flex-end">
                          <Typography variant="caption" noWrap>
                            ตรวจเมื่อ{' '}
                            {format(
                              parseISO(student.scoreInfo.gradedAt),
                              'PPp',
                              { locale: th }
                            )}
                          </Typography>
                          <Stack direction="row" alignItems="center">
                            <Typography variant="caption" noWrap>
                              โดย {student.scoreInfo?.gradedBy}
                            </Typography>
                            <CheckCircleIcon
                              color="success"
                              fontSize="inherit"
                              sx={{ ml: 0.5 }}
                            />
                          </Stack>
                        </Stack>
                      ) : (
                        <Tooltip
                          arrow
                          title={
                            <>
                              <Typography variant="body2">
                                {`ตรวจล่าสุดเมื่อ ${format(
                                  parseISO(student.scoreInfo.gradedAt),
                                  'PPp',
                                  { locale: th }
                                )}`}
                              </Typography>
                              <Typography variant="body2">
                                {`แต่มีการส่งเข้ามาใหม่เมื่อ ${format(
                                  parseISO(student.submission.createdAt),
                                  'PPp',
                                  { locale: th }
                                )}
                                `}
                              </Typography>
                            </>
                          }
                        >
                          <Typography
                            className="cursor-pointer"
                            variant="caption"
                            noWrap
                          >
                            มีการแก้ไข
                          </Typography>
                        </Tooltip>
                      )
                    ) : (
                      <Typography variant="caption" noWrap>
                        รอการตรวจ
                      </Typography>
                    )
                  ) : (
                    <Typography variant="caption" color="error" noWrap>
                      ยังไม่ส่งงาน
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* Source Code */}
          {student.submission && assignment.type === 'java-src' && (
            <>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {student.submission.sourceCode && (
                    <SourceCodeSection
                      sourceCode={student.submission.sourceCode}
                    />
                  )}
                </Paper>
              </Grid>

              {/* Testcases */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {student.submission.testcases &&
                    student.submission.testcases.length > 0 && (
                      <SubmissionTestcasesSection
                        testcases={student.submission.testcases}
                      />
                    )}
                </Paper>
              </Grid>
            </>
          )}

          {/* Submitted Files */}
          {student.submission && assignment.type === 'docs' && (
            <>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  Files
                </Paper>
              </Grid>
            </>
          )}

          {/* Comments */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <AssignmentCommentsSection
                assignment={assignment}
                classroomSlug={classroom?.slug ?? ''}
                defaultPrivate
                hostId={student.id.toString() as string}
              />
            </Paper>
          </Grid>
        </Grid>
      )}

      {isSuccess && !student && (
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h6" align="center">
              ไม่พบนักศึกษา
            </Typography>
          </Grid>
        </Grid>
      )}
    </section>
  );
};

export default AssignmentSubmission;

AssignmentSubmission.getLayout = (page) => {
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

    const AssignmentSubmission = await queryClient.fetchQuery(
      ['submissions', { assignmentId: assignmentId }],
      () => getAssignmentSubmissions(assignmentId, classroom.id.toString())
    );

    if (!AssignmentSubmission) {
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
