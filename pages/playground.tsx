import BrandingButton from '@/components/buttons/branding/BrandingButton';
import AssignmentContentCard from '@/components/cards/assignment-content/AssignmentContentCard';
import InputDialog from '@/components/dialogs/input-dialog/InputDialog';
import CodeEditor from '@/components/editors/code/CodeEditor';
import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import TestCasesList from '@/components/lists/testcases-list/TestCasesList';
import OutputBox from '@/components/output-box/OutputBox';
import { compileStatus } from '@/constants/compileStatuses';
import { Java, PlainText } from '@/constants/languageTemplate';
import { useAssignment } from '@/hooks/assignment/useAssignment';
import { useIdeTabs } from '@/hooks/grader/useIdeTabs';
import { useTestcases } from '@/hooks/grader/useTestcases';
import { Submission } from '@/types/types';
import { compressSourceCode, createSubmission } from '@/utils/GraderService';
import { Monaco } from '@monaco-editor/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ContentCopy from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PublishIcon from '@mui/icons-material/Publish';
import { Box, Drawer, Fab, Toolbar, Tooltip } from '@mui/material';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { CgCodeSlash } from 'react-icons/cg';
import { ImLab } from 'react-icons/im';
import { VscOutput, VscPlay, VscRunAll } from 'react-icons/vsc';
import { NextPageWithLayout } from './page';

const Playground: NextPageWithLayout = () => {
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const [anchorOutputMenu, setAnchorOutputMenu] = useState<null | HTMLElement>(
    null
  );
  const [anchorCopiedAlert, setAnchorCopiedAlert] =
    useState<null | HTMLElement>(null);
  const openOutputMenu = Boolean(anchorOutputMenu);
  const openCopiedAlert = Boolean(anchorCopiedAlert);
  const [openInputDialog, setOpenInputDialog] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const { testcases, runAllTestCases } = useTestcases();
  const { ideTabs } = useIdeTabs();
  const queryClient = useQueryClient();

  const router = useRouter();
  const assignmentId = router.query.assignmentId as string;
  const { data: assignment } = useAssignment({ id: assignmentId });
  const [openDrawer, setOpenDrawer] = useState(false);

  const {
    isFetching: loadingProgram,
    data: program,
    refetch,
  } = useQuery<Submission>(['program'], () => executeProgram(), {
    enabled: false,
  });

  const executeProgram = async (): Promise<Submission> => {
    const src = await compressSourceCode(ideTabs);
    const params = {
      languageId: 89,
      sourceCode: undefined,
      additionalFiles: src,
      stdin: customInput,
    };
    const submission = await createSubmission(params);

    return submission as Submission;
  };

  const handleExecProgram = () => {
    refetch();
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
  };

  const handleOutputDidMount = (editor: any, monaco: Monaco) => {
    outputRef.current = editor;
  };

  const handleOutputMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorOutputMenu(event.currentTarget);
  };

  const handleCloseOutputMenu = () => {
    setAnchorOutputMenu(null);
  };

  const handleCloseCopiedAlert = () => {
    setAnchorCopiedAlert(null);
  };

  const handleCopyButton = (event: React.MouseEvent<HTMLLIElement>) => {
    const output: any = outputRef.current;
    navigator.clipboard.writeText(output.getValue());
    setAnchorCopiedAlert(event.currentTarget);
    handleCloseOutputMenu();
  };

  const handleCustomInputButton = () => {
    setOpenInputDialog(true);
    handleCloseOutputMenu();
  };

  const handleClearButton = () => {
    queryClient.setQueryData(['program'], {
      ...program,
      stderr: '',
      compile_output: '',
      stdout: '',
    });
    handleCloseOutputMenu();
  };

  const renderStatusChip = (statusId: number) => {
    const getBgColorAndLabel = (statusId: number) => {
      const status = compileStatus.find((obj) => obj.id === statusId);
      return {
        bgColor: `${status ? status.color : compileStatus[0].color}.main`,
        label: status ? status.description : compileStatus[0].description,
      };
    };
    const { bgColor, label } = getBgColorAndLabel(statusId);

    return (
      <Chip
        className="font-bold"
        sx={{
          bgcolor: bgColor,
          color: 'white',
        }}
        size="small"
        label={label}
      />
    );
  };

  return (
    <section className="pt-24 px-10 min-h-screen">
      <InputDialog
        open={openInputDialog}
        setOpen={setOpenInputDialog}
        input={customInput}
        setInput={setCustomInput}
      />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingProgram}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openCopiedAlert}
        autoHideDuration={6000}
        onClose={handleCloseCopiedAlert}
      >
        <Alert
          className="shadow-xl"
          onClose={handleCloseCopiedAlert}
          severity="success"
          sx={{ width: '100%' }}
        >
          คัดลอก Output แล้ว!
        </Alert>
      </Snackbar>

      {assignment && (
        <Fab
          variant="extended"
          color="success"
          onClick={() => alert('ส่งงาน')}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
        >
          <PublishIcon sx={{ mr: 1 }} />
          ส่งงาน
        </Fab>
      )}

      {assignment && (
        <Drawer
          anchor="left"
          sx={{
            width: { xs: '100%', md: '60%' },
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: { xs: '100%', md: '60%' },
              boxSizing: 'border-box',
            },
          }}
          open={openDrawer}
          onClose={() => {
            setOpenDrawer(false);
          }}
        >
          <Toolbar
            sx={{
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <IconButton
              aria-label="hide-problem"
              onClick={() => setOpenDrawer(false)}
            >
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
          </Toolbar>
          <Divider />
          <Box sx={{ overflow: 'auto' }}>
            <AssignmentContentCard assignment={assignment} />
          </Box>
        </Drawer>
      )}

      <Grid
        container
        spacing={{ xs: 2, sm: 2, md: 3, lg: 4 }}
        justifyContent="center"
        paddingBottom={{ xs: 12, sm: 12, md: 10, lg: 10 }}
      >
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <Container>
            <Card className="shadow-xl">
              <CardHeader
                title={
                  <Stack direction="column">
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={1}
                    >
                      <CgCodeSlash />
                      <Typography
                        className="font-bold"
                        variant="h5"
                        gutterBottom
                      >
                        Code Editor
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      marginBottom={1}
                      noWrap
                      sx={{ ml: 4, mb: 0 }}
                    >
                      {assignment?.title}
                    </Typography>
                  </Stack>
                }
                action={
                  <>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        display: {
                          xs: 'flex',
                          md: 'none',
                        },
                      }}
                    >
                      {assignment && (
                        <Tooltip title="ดูโจทย์">
                          <IconButton
                            color="info"
                            onClick={() => setOpenDrawer(true)}
                          >
                            <MenuBookIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Execute">
                        <IconButton color="primary" onClick={handleExecProgram}>
                          <VscPlay />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        display: {
                          xs: 'none',
                          md: 'flex',
                        },
                      }}
                    >
                      {assignment && (
                        <Button
                          className="font-bold"
                          variant="outlined"
                          startIcon={<MenuBookIcon />}
                          onClick={() => setOpenDrawer(true)}
                        >
                          ดูโจทย์
                        </Button>
                      )}
                      <Button
                        className="font-bold"
                        variant="contained"
                        startIcon={<VscPlay />}
                        onClick={handleExecProgram}
                      >
                        Execute
                      </Button>
                    </Stack>
                  </>
                }
                sx={{
                  display: 'flex',
                  overflow: 'hidden',
                  '& .MuiCardHeader-content': {
                    overflow: 'hidden',
                  },
                }}
              />
              <CardMedia>
                <CodeEditor
                  language={Java.lang}
                  template={Java.template}
                  onMount={handleEditorDidMount}
                />
              </CardMedia>
              <CardActions className="justify-end">
                <Stack py={0.5} direction="row" alignItems="center" spacing={1}>
                  <Typography variant="caption" display="block">
                    Status:
                  </Typography>
                  {renderStatusChip(program ? program.status_id : 0)}
                </Stack>
              </CardActions>
            </Card>
          </Container>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Container>
            <Card className="shadow-xl">
              <CardHeader
                title={
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                  >
                    <VscOutput />
                    <Typography
                      className="font-bold"
                      variant="h5"
                      marginBottom={1}
                    >
                      Output
                    </Typography>
                  </Stack>
                }
                action={
                  <IconButton
                    aria-label="open-output-menu"
                    aria-controls={openOutputMenu ? 'output-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openOutputMenu ? 'true' : undefined}
                    onClick={handleOutputMenuClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Menu
                id="output-menu"
                anchorEl={anchorOutputMenu}
                open={openOutputMenu}
                onClose={handleCloseOutputMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleCustomInputButton}>
                  <ListItemIcon>
                    <InsertDriveFileIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Input</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleCopyButton}>
                  <ListItemIcon>
                    <ContentCopy fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem aria-label="delete" onClick={handleClearButton}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Clear</ListItemText>
                </MenuItem>
              </Menu>
              <CardMedia>
                <OutputBox
                  queryKey={['program']}
                  language={PlainText.lang}
                  onMount={handleOutputDidMount}
                />
              </CardMedia>
              <CardActions className="justify-center">
                {program && program.time > 0 && program.memory > 0 ? (
                  <Stack
                    py={0.5}
                    direction={{
                      xs: 'row',
                      sm: 'row',
                      md: 'column',
                      lg: 'row',
                      xl: 'row',
                    }}
                    spacing={2}
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" display="block">
                        Time:
                      </Typography>
                      <Chip
                        className="font-bold"
                        color="primary"
                        size="small"
                        label={program.time + ' s'}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" display="block">
                        Memory:
                      </Typography>
                      <Chip
                        className="font-bold"
                        color="primary"
                        size="small"
                        label={
                          program.memory
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' KB'
                        }
                      />
                    </Stack>
                  </Stack>
                ) : (
                  <BrandingButton withText />
                )}
              </CardActions>
            </Card>
          </Container>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Container>
            <Card className="shadow-xl">
              <CardHeader
                title={
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                  >
                    <ImLab />
                    <Typography
                      className="font-bold"
                      variant="h5"
                      marginBottom={1}
                    >
                      Test cases
                    </Typography>
                  </Stack>
                }
                action={
                  <Button
                    className="font-bold"
                    variant="contained"
                    startIcon={<VscRunAll />}
                    onClick={runAllTestCases}
                    disabled={testcases.length === 0 ? true : false}
                  >
                    Run All
                  </Button>
                }
              />
              <CardContent>
                <TestCasesList runnable />
              </CardContent>
            </Card>
          </Container>
        </Grid>
      </Grid>
    </section>
  );
};

export default Playground;

Playground.getLayout = (page) => {
  return <PrimaryLayout title="เพลย์กราวด์">{page}</PrimaryLayout>;
};
