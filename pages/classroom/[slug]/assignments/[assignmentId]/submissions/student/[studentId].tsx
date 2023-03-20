import FeedbackLayout from '@/components/layouts/feedback/FeedbackLayout';
import AssignmentCommentsSection from '@/components/sections/assignment-comments/AssignmentCommentsSection';
import FilesSection from '@/components/sections/files/FilesSection';
import SourceCodeSection from '@/components/sections/source-code/SourceCodeSection';
import SubmissionTestcasesSection from '@/components/sections/submission-testcases/SubmissionTestcasesSection';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useAssignmentSubmissions } from '@/hooks/submission/useSubmission';
import { setToken } from '@/utils/APIHelper';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import { getImagePath } from '@/utils/imagePath';
import { getAssignmentSubmissions } from '@/utils/SubmissionService';
import { getUserFullName } from '@/utils/UserService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HistoryIcon from '@mui/icons-material/History';
import {
  Alert,
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
import { useRouter } from 'next/router';
import { useMemo } from 'react';
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

  return (
    <section>
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
                    {getUserFullName(student)}
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

                  {!student.submission && (
                    <Typography variant="caption" color="error" noWrap>
                      ยังไม่ส่งงาน
                    </Typography>
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

                  {!student.scoreInfo && (
                    <Typography variant="caption" color="error" noWrap>
                      ยังไม่ได้ตรวจ
                    </Typography>
                  )}

                  {student.scoreInfo &&
                    (!student.submission ||
                      (student.submission &&
                        !isBefore(
                          parseISO(student.scoreInfo.gradedAt),
                          parseISO(student.submission.createdAt)
                        ))) && (
                      <Stack direction="column" alignItems="flex-end">
                        <Typography variant="caption" noWrap>
                          ตรวจเมื่อ{' '}
                          {format(parseISO(student.scoreInfo.gradedAt), 'PPp', {
                            locale: th,
                          })}
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
                    )}

                  {student.submission &&
                    student.scoreInfo &&
                    isBefore(
                      parseISO(student.scoreInfo.gradedAt),
                      parseISO(student.submission.createdAt)
                    ) && (
                      <Stack direction="row" alignItems="center">
                        <Typography variant="caption" noWrap>
                          มีการแก้ไข
                        </Typography>
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
                          <HistoryIcon
                            color="info"
                            fontSize="inherit"
                            sx={{ ml: 0.5, cursor: 'pointer' }}
                          />
                        </Tooltip>
                      </Stack>
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
                  {student.submission.files &&
                  student.submission.files.length > 0 ? (
                    <FilesSection files={student.submission.files ?? []} />
                  ) : (
                    <Tooltip
                      arrow
                      title={
                        <Typography variant="body2">
                          อาจเกิดจากการที่นักศึกษาส่งงานโดยที่ไม่แนบไฟล์เข้ามา
                          โดยการคลิกที่ปุ่ม &quot;ทำเครื่องหมายว่าส่งแล้ว&quot;
                          ก็เป็นได้
                        </Typography>
                      }
                    >
                      <Alert
                        severity="warning"
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        ไม่พบไฟล์งานที่นักศึกษาส่งเข้ามา
                      </Alert>
                    </Tooltip>
                  )}
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
  const { slug, feedbackHeaderProps, contentProps, title } = props;
  return (
    <FeedbackLayout
      classroomSlug={slug}
      feedbackHeaderProps={feedbackHeaderProps}
      contentProps={contentProps}
      title={title}
    >
      {page}
    </FeedbackLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug, assignmentId, studentId }: any = context.params;
  const { req } = context;
  const token = await getToken({ req });

  if (token && token.jwt) {
    setToken(token.jwt);
  }

  const queryClient = new QueryClient();
  let title = 'ไม่พบหน้า';

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

    const assignmentName =
      assignmentSubmissions.title.length > 20
        ? (title = assignmentSubmissions.title.slice(0, 20) + '...')
        : assignmentSubmissions.title;

    const student = assignmentSubmissions.students.find(
      (student) => student.id.toString() === studentId
    );

    const studentName = student && getUserFullName(student);

    title = `งานของ ${studentName} | ${assignmentName} | ${classroom.name} - ${classroom.course?.name}`;
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug: slug,
      title: title,
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
