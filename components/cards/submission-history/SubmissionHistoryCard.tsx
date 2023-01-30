import GraderStatusChip from '@/components/chips/grader-status/GraderStatusChip';
import MarkdownPreview from '@/components/previews/markdown/MarkdownPreview';
import { useUserSubmissionPages } from '@/hooks/submission/useSubmission';
import { useUser } from '@/hooks/user/useUser';
import { getImagePath } from '@/utils/imagePath';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  alpha,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Link as MuiLink,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { format, isAfter, isBefore, isValid, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';
import { CgCodeSlash } from 'react-icons/cg';
import { ImLab } from 'react-icons/im';

export interface ISubmissionHistoryCard {
  classroomId: string;
  assignmentId: string;
  showMenu?: boolean;
  classroomSlug?: string;
}

const SubmissionHistoryCard: React.FC<ISubmissionHistoryCard> = ({
  classroomId,
  assignmentId,
  showMenu,
  classroomSlug,
}) => {
  const { data: user } = useUser();
  const router = useRouter();
  const theme = useTheme();

  const [page, setPage] = useState(1);
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const { data: { submissions, meta } = {} } = useUserSubmissionPages({
    classroomId: classroomId,
    assignmentId: assignmentId,
    userId: user?.id.toString() as string,
    page: (page - 1) * 5,
  });

  const [openSrcList, setOpenSrcList] = useState([false]);
  const [openTestcasesList, setOpenTestcasesList] = useState([false]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMoreButtonClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleSrcListClick = (id: number) => {
    setOpenSrcList((prevState: boolean[]) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleTestcasesListClick = (id: number) => {
    setOpenTestcasesList((prevState: boolean[]) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <>
      {submissions && (
        <Card
          className="shadow-xl w-full"
          variant="outlined"
          sx={{ px: 2, py: 4 }}
        >
          <CardHeader
            sx={{ py: 0 }}
            title={<Typography variant="body2">{`หน้า ${page}`}</Typography>}
            action={
              showMenu && (
                <IconButton
                  aria-controls={open ? 'invite-code-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleMoreButtonClick}
                  aria-label="more"
                >
                  <MoreVertIcon />
                </IconButton>
              )
            }
          />
          <CardContent className="w-full">
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography
                className="font-extrabold text-center"
                component="h1"
                variant="h4"
                gutterBottom
              >
                {submissions[0]?.assignment.title}
              </Typography>

              {user && (
                <Stack direction="row" spacing={2}>
                  <Avatar
                    alt={
                      user.username
                        ? `${user.username}'s profile image`
                        : undefined
                    }
                    src={
                      user.profileImage
                        ? getImagePath(user.profileImage)
                        : undefined
                    }
                  >
                    {user.firstName && user.lastName
                      ? user.firstName?.charAt(0) + user.lastName?.charAt(0)
                      : user.username?.charAt(0)}
                  </Avatar>
                  <Stack direction="column">
                    <Typography className="font-bold" variant="body2">
                      {user.firstName + ' ' + user.lastName}
                    </Typography>
                    <Link href={`/p/@${user.username}`} passHref>
                      <MuiLink sx={{ p: 0, m: 0 }}>
                        <Typography variant="caption">
                          @{user.username}
                        </Typography>
                      </MuiLink>
                    </Link>
                  </Stack>
                </Stack>
              )}

              <Divider sx={{ my: 2 }} />
            </Stack>

            {meta &&
              submissions
                .sort((a, b) =>
                  isBefore(parseISO(a.createdAt), parseISO(b.createdAt))
                    ? 1
                    : -1
                )
                .map((submission, index) => (
                  <Box
                    key={submission.id}
                    sx={{
                      my: 4,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      pl: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center">
                      <Typography className="font-bold" variant="h6">
                        {`ส่งครั้งที่ ${meta.total - (page - 1) * 5 - index}`}
                      </Typography>
                      {meta.total - (page - 1) * 5 - index === meta.total && (
                        <Tooltip title="คะแนนงานของคุณจะอิงตามการส่งในครั้งนี้">
                          <Chip
                            label={'ล่าสุด'}
                            variant="outlined"
                            color="info"
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        </Tooltip>
                      )}
                    </Stack>
                    <Typography variant="body2" gutterBottom>
                      {`คะแนน ${submission.point}/${submission.assignment.point}`}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {`ผ่านชุดทดสอบ ${submission.passedTestcases}/${submission.testcases.length} ชุด`}
                    </Typography>
                    {isValid(parseISO(submission.createdAt)) &&
                      isValid(parseISO(submission.assignment.endDate)) && (
                        <Tooltip
                          title={`วันกำหนดส่ง คือ ${format(
                            parseISO(submission.assignment.endDate),
                            'PPPPp',
                            {
                              locale: th,
                            }
                          )}`}
                        >
                          <Typography
                            className="cursor-pointer"
                            variant="body2"
                            gutterBottom
                            color={
                              isBefore(
                                parseISO(submission.createdAt),
                                parseISO(submission.assignment.endDate)
                              )
                                ? 'text.primary'
                                : 'error'
                            }
                          >
                            {`ส่งเมื่อ ${format(
                              parseISO(submission.createdAt),
                              'PPPPp',
                              {
                                locale: th,
                              }
                            )}`}
                            {isAfter(
                              parseISO(submission.createdAt),
                              parseISO(submission.assignment.endDate)
                            ) && ' (ส่งช้า)'}
                          </Typography>
                        </Tooltip>
                      )}
                    {submission.sourceCode && (
                      <>
                        <ListItemButton
                          onClick={() => handleSrcListClick(submission.id)}
                        >
                          <ListItemIcon>
                            <CgCodeSlash />
                          </ListItemIcon>
                          <ListItemText primary="ซอร์สโค้ด" />
                          {openSrcList[submission.id] ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </ListItemButton>
                        <Collapse
                          in={openSrcList[submission.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <div data-color-mode={theme.palette.mode}>
                            <MarkdownPreview
                              content={
                                '```java\n' + submission.sourceCode + '```'
                              }
                            />
                          </div>
                        </Collapse>
                      </>
                    )}
                    {submission.testcases.length > 0 && (
                      <>
                        <ListItemButton
                          onClick={() =>
                            handleTestcasesListClick(submission.id)
                          }
                        >
                          <ListItemIcon>
                            <ImLab />
                          </ListItemIcon>
                          <ListItemText primary="ชุดทดสอบ" />
                          {openTestcasesList[submission.id] ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </ListItemButton>
                        <Collapse
                          in={openTestcasesList[submission.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>ชุดทดสอบ</TableCell>
                                  <TableCell align="right">เวลา</TableCell>
                                  <TableCell align="right">
                                    หน่วยความจำ
                                  </TableCell>
                                  <TableCell align="center">ผลตรวจ</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {submission.testcases.map((testcase, idx) => (
                                  <TableRow
                                    key={testcase.id}
                                    sx={{
                                      backgroundColor: alpha(
                                        testcase.status === 3
                                          ? theme.palette.success.light
                                          : theme.palette.error.light,
                                        0.3
                                      ),
                                    }}
                                  >
                                    <TableCell component="th" scope="row">
                                      {`ชุดทดสอบที่ ${idx + 1}`}
                                    </TableCell>
                                    <TableCell align="right">
                                      {testcase.time
                                        ? testcase.time + ' ms'
                                        : '-'}
                                    </TableCell>
                                    <TableCell align="right">
                                      {testcase.memory
                                        ? testcase.memory
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ','
                                            ) + ' KB'
                                        : '-'}
                                    </TableCell>
                                    <TableCell align="center">
                                      <GraderStatusChip
                                        statusId={testcase.status}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Collapse>
                      </>
                    )}
                  </Box>
                ))}
            {meta && (
              <Stack
                direction="column"
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Pagination
                  color="primary"
                  page={page}
                  onChange={handlePageChange}
                  count={Math.ceil(meta.total / 5)}
                />
                <Typography variant="caption">
                  ผลลัพธ์ทั้งหมด {meta.total} รายการ
                </Typography>
              </Stack>
            )}
          </CardContent>
        </Card>
      )}

      {showMenu && submissions && (
        <Menu
          id="post-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          MenuListProps={{
            'aria-labelledby': 'post-menu',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            onClick={() =>
              router.push(
                `/classroom/${classroomSlug}/assignments/${submissions[0]?.assignment.id}`
              )
            }
            disableRipple
          >
            <AssignmentIcon sx={{ mr: 1 }} />
            ไปยังหน้าโพสต์
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default SubmissionHistoryCard;
