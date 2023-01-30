import { compileStatus } from '@/constants/compileStatuses';
import { useTestcases } from '@/hooks/grader/useTestcases';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { MdOutlineAddCircleOutline, MdPostAdd } from 'react-icons/md';

export interface ITestCasesList {
  runnable?: boolean;
}

const TestCasesList: React.FC<ITestCasesList> = ({ runnable }) => {
  const [openTestCaseList, setOpenTestCaseList] = useState([false]);
  const [openNewTestCase, setOpenNewTestCase] = useState(true);
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [name, setName] = useState('');
  const [passedTestCases, setPassedTestCases] = useState(0);
  const { testcases, addTestcase, removeTestcase, runTestCase } =
    useTestcases();

  useEffect(() => {
    if (testcases && runnable) {
      if (testcases.length > 0) {
        let passed = testcases?.filter(
          (testcase) => testcase.status === 3
        ).length;
        setPassedTestCases(passed);
      }
    }
  }, [testcases, runnable]);

  const handleInputChange = (event: { target: { value: any } }) => {
    setInput(event.target.value);
  };

  const handleExpectedOutputChange = (event: { target: { value: any } }) => {
    setExpectedOutput(event.target.value);
  };

  const handleNameChange = (event: { target: { value: any } }) => {
    setName(event.target.value);
  };

  const handleTestCaseListClick = (id: number) => {
    setOpenTestCaseList((prevState: boolean[]) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const getPassedTestCasesChipColor = () => {
    if (passedTestCases === testcases?.length && testcases?.length > 0) {
      return 'success.main';
    } else if (passedTestCases > 0) {
      return 'warning.main';
    }
    return 'error.main';
  };

  const handleAddTestCaseButton = () => {
    if (testcases && name != '' && expectedOutput != '') {
      const testcase = {
        id: new Date().valueOf() + Math.floor(Math.random()),
        name: name,
        input: input,
        expectedOutput: expectedOutput,
        status: 0,
        loading: false,
      };
      addTestcase(testcase);
    }
  };

  const handleRemoveTestCaseButton = (id: number) => {
    removeTestcase(id);
  };

  return (
    <Box>
      {testcases.length > 0 && runnable && (
        <Stack
          py={0.5}
          direction="row"
          alignItems="center"
          spacing={1}
          justifyContent="flex-end"
        >
          <Typography variant="h6" display="block">
            ผ่าน
          </Typography>
          <Chip
            sx={{
              bgcolor: getPassedTestCasesChipColor(),
              color: 'white',
            }}
            size="small"
            label={passedTestCases}
          />
          <Typography variant="h6" display="block">
            /{testcases.length} Cases
          </Typography>
        </Stack>
      )}
      <List
        sx={{
          width: '100%',
        }}
      >
        {testcases &&
          testcases.map((testcase) => (
            <Box key={testcase.id}>
              <ListItem className="items-start text-start">
                <ListItemText
                  primaryTypographyProps={{
                    style: {
                      whiteSpace: 'unset',
                      wordBreak: 'break-all',
                    },
                  }}
                  primary={
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={1}
                    >
                      {runnable && (
                        <LoadingButton
                          onClick={() => runTestCase(testcase)}
                          loading={testcase.loading}
                          color="success"
                          disabled={testcase.loading}
                        >
                          <PlayCircleIcon fontSize="large" />
                        </LoadingButton>
                      )}
                      {testcase.name}
                      {testcase.status >= 3 && runnable && (
                        <Chip
                          sx={{
                            bgcolor:
                              compileStatus.find(
                                (obj) => obj.id === testcase.status
                              )?.color + '.main',
                            color: 'white',
                            marginHorizontal: 2,
                          }}
                          size="small"
                          label={
                            compileStatus.find(
                              (obj) => obj.id === testcase.status
                            )?.description
                          }
                        />
                      )}
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleRemoveTestCaseButton(testcase.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  }
                />
                <IconButton
                  onClick={() => handleTestCaseListClick(testcase.id)}
                >
                  {openTestCaseList[testcase.id] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </IconButton>
              </ListItem>
              <Collapse
                in={openTestCaseList[testcase.id]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  <ListItem className="px-7">
                    <ListItemText
                      primary={
                        <Grid
                          container
                          direction={{
                            xs: 'column',
                            sm: 'column',
                            md: 'row',
                            lg: 'row',
                          }}
                          spacing={{ xs: 2, sm: 2 }}
                        >
                          <Grid item xs className="mx-3">
                            <Typography variant="caption" display="block">
                              Input
                            </Typography>
                            <code className="whitespace-pre overflow-x-scroll">
                              {testcase.input}
                            </code>
                          </Grid>
                          <Divider orientation="vertical" flexItem />
                          <Grid item xs className="mx-3">
                            <Typography variant="caption" display="block">
                              Expected Output
                            </Typography>
                            <code className="whitespace-pre overflow-x-scroll">
                              {testcase.expectedOutput}
                            </code>
                          </Grid>
                        </Grid>
                      }
                    />
                  </ListItem>
                </List>
              </Collapse>
              <Divider />
            </Box>
          ))}
        <ListItem>
          <IconButton>
            <MdPostAdd />
          </IconButton>
          <ListItemText primary="เพิ่ม Testcase ใหม่" />
          <IconButton
            onClick={() => setOpenNewTestCase((prevState) => !prevState)}
          >
            {openNewTestCase ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItem>
        <Collapse in={openNewTestCase} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem>
              <ListItemText
                primary={
                  <Grid
                    className="pb-4"
                    container
                    direction={{
                      xs: 'column',
                      sm: 'column',
                      md: 'row',
                      lg: 'row',
                    }}
                    spacing={{ xs: 2, sm: 2 }}
                  >
                    <Grid item xs={12} className="mx-3">
                      <Typography variant="caption" display="block">
                        Name
                      </Typography>
                      <TextField
                        margin="dense"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={handleNameChange}
                      />
                    </Grid>
                    <Grid item xs className="mx-3">
                      <Typography variant="caption" display="block">
                        Input
                      </Typography>
                      <TextField
                        margin="dense"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        value={input}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item xs className="mx-3">
                      <Typography variant="caption" display="block">
                        Expected Output
                      </Typography>
                      <TextField
                        margin="dense"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        value={expectedOutput}
                        onChange={handleExpectedOutputChange}
                      />
                    </Grid>
                    <Grid item xs={12} className="mx-3">
                      <Button
                        className="w-full px-3"
                        variant="contained"
                        onClick={handleAddTestCaseButton}
                        startIcon={<MdOutlineAddCircleOutline />}
                        disabled={
                          name != '' && expectedOutput != '' ? false : true
                        }
                      >
                        เพิ่ม
                      </Button>
                    </Grid>
                  </Grid>
                }
              />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default TestCasesList;
