import { Monaco } from '@monaco-editor/react';
import ContentCopy from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
import { getSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { CgCodeSlash } from 'react-icons/cg';
import { ImLab } from 'react-icons/im';
import { VscOutput, VscPlay, VscRunAll } from 'react-icons/vsc';
import CodeEditor from '../components/code-editor/CodeEditor';
import InputDialog from '../components/input-dialog/InputDialog';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import Branding from '../components/navigation/branding/Branding';
import OutputBox from '../components/output-box/OutputBox';
import TestCasesList, {
  ITestCase,
} from '../components/testcases-list/TestCasesList';
import { compileStatus } from '../utils/compileStatuses';
import { Java, PlainText } from '../utils/languageTemplate';
import { createSubmission } from '../utils/submission';
import { NextPageWithLayout } from './page';

const Playground: NextPageWithLayout = () => {
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const [isProgress, setIsProgress] = useState(false);
  const [status, setStatus] = useState(0);
  const [anchorOutputMenu, setAnchorOutputMenu] = useState<null | HTMLElement>(
    null
  );
  const [anchorCopiedAlert, setAnchorCopiedAlert] =
    useState<null | HTMLElement>(null);
  const openOutputMenu = Boolean(anchorOutputMenu);
  const openCopiedAlert = Boolean(anchorCopiedAlert);
  const [openInputDialog, setOpenInputDialog] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [time, setTime] = useState(0);
  const [memory, setMemory] = useState(0);
  const [testcases, setTestcases] = useState<ITestCase[]>([]);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
  };

  const handleOutputDidMount = (editor: any, monaco: Monaco) => {
    outputRef.current = editor;
  };

  const handleRunButton = async () => {
    setIsProgress(true);

    await executeCode();

    setIsProgress(false);
  };

  const executeCode = async () => {
    const editor: any = editorRef.current;
    const output: any = outputRef.current;
    const params = {
      languageId: 4,
      sourceCode: editor.getValue(),
      stdin: customInput,
    };

    try {
      const submission = await createSubmission(params);

      setStatus(submission.status_id);
      setTime(submission.time);
      setMemory(submission.memory);

      if (submission.stderr != '') {
        output.setValue(submission.stderr);
      } else if (submission.compile_output != '') {
        output.setValue(submission.compile_output);
      } else {
        output.setValue(submission.stdout);
      }
    } catch (error) {
      setStatus(15);
    }
  };

  const handleRunAllTestCasesButton = async () => {
    await runAllTestCases();
  };

  const runTestCase = async (testcase: ITestCase) => {
    const editor: any = editorRef.current;
    const params = {
      languageId: 4,
      sourceCode: editor.getValue(),
      stdin: testcase.input,
      expectedOutput: testcase.expectedOutput,
    };

    setTestcases((currentTestcases) =>
      currentTestcases.map((t) =>
        t.id === testcase.id ? { ...t, loading: true, status: 0 } : t
      )
    );

    try {
      const submission = await createSubmission(params);

      setTestcases((currentTestcases) =>
        currentTestcases.map((t) =>
          t.id === testcase.id
            ? { ...t, status: submission.status_id, loading: false }
            : t
        )
      );
    } catch {
      setTestcases((currentTestcases) =>
        currentTestcases.map((t) =>
          t.id === testcase.id ? { ...t, status: 15, loading: false } : t
        )
      );
    }
  };

  const runAllTestCases = async () => {
    testcases.forEach(async (testcase) => {
      runTestCase(testcase);
    });
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
    const output: any = outputRef.current;
    output.setValue('');
    handleCloseOutputMenu();
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
        open={isProgress}
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
          Output copied!
        </Alert>
      </Snackbar>

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
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                  >
                    <CgCodeSlash />
                    <Typography variant="h5" marginBottom={1}>
                      Java Code Editor
                    </Typography>
                  </Stack>
                }
                action={
                  <Button
                    variant="contained"
                    startIcon={<VscPlay />}
                    onClick={handleRunButton}
                  >
                    Execute
                  </Button>
                }
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
                  <Chip
                    sx={{
                      bgcolor:
                        compileStatus.find((obj) => obj.id === status)?.color +
                        '.main',
                      color: 'white',
                    }}
                    size="small"
                    label={
                      compileStatus.find((obj) => obj.id === status)
                        ?.description
                    }
                  />
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
                    <Typography variant="h5" marginBottom={1}>
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
                  language={PlainText.lang}
                  onMount={handleOutputDidMount}
                />
              </CardMedia>
              <CardActions className="justify-center">
                {time > 0 && memory > 0 ? (
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
                      <Chip color="primary" size="small" label={time + ' s'} />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" display="block">
                        Memory:
                      </Typography>
                      <Chip
                        color="primary"
                        size="small"
                        label={
                          memory
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' KB'
                        }
                      />
                    </Stack>
                  </Stack>
                ) : (
                  <Branding withText />
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
                    <Typography variant="h5" marginBottom={1}>
                      Test cases
                    </Typography>
                  </Stack>
                }
                action={
                  <Button
                    variant="contained"
                    startIcon={<VscRunAll />}
                    onClick={handleRunAllTestCasesButton}
                    disabled={testcases.length === 0 ? true : false}
                  >
                    Run All
                  </Button>
                }
              />
              <CardContent>
                <TestCasesList
                  testcases={testcases}
                  setTestcases={setTestcases}
                  runTestCase={runTestCase}
                />
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
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);
  // Check if session exists or not, if not, redirect
  if (session == null) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: true,
      },
    };
  }
  return {
    props: {},
  };
};
