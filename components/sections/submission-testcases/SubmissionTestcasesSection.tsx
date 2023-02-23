import GraderStatusChip from '@/components/chips/grader-status/GraderStatusChip';
import { UserSubmission } from '@/types/types';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import React, { useState } from 'react';
import { ImLab } from 'react-icons/im';

export interface ISubmissionTestcasesSection {
  testcases: UserSubmission['testcases'];
}

const SubmissionTestcasesSection: React.FC<ISubmissionTestcasesSection> = ({
  testcases,
}) => {
  const [openTestcasesSection, setOpenTestcasesSection] = useState(false);

  const handleOpenTestcasesSection = () => {
    setOpenTestcasesSection(!openTestcasesSection);
  };

  const [expandTestcases, setExpandTestcases] = useState([false]);

  const handleExpandTestcases = (index: number) => {
    setExpandTestcases((prev) => {
      const newExpandTestcases = [...prev];
      newExpandTestcases[index] = !newExpandTestcases[index];
      return newExpandTestcases;
    });
  };

  return (
    <>
      {testcases && testcases.length > 0 && (
        <>
          <ListItemButton onClick={handleOpenTestcasesSection}>
            <ListItemIcon>
              <ImLab />
            </ListItemIcon>
            <ListItemText primary="ชุดทดสอบ" />
            {openTestcasesSection ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openTestcasesSection} timeout="auto" unmountOnExit>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ชุดทดสอบ</TableCell>
                    <TableCell align="right">ข้อมูลนำเข้า</TableCell>
                    <TableCell align="right">ผลลัพธ์ที่ต้องการ</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testcases.map((testcase, idx) => (
                    <React.Fragment key={testcase.id}>
                      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                        {testcase.name ? (
                          <>
                            <TableCell component="th" scope="row">
                              {testcase.name}
                            </TableCell>
                            <TableCell align="right">
                              <code className="whitespace-pre overflow-x-scroll">
                                {testcase.input}
                              </code>
                            </TableCell>
                            <TableCell align="right">
                              <code className="whitespace-pre overflow-x-scroll">
                                {testcase.expectedOutput}
                              </code>
                            </TableCell>
                          </>
                        ) : (
                          <TableCell component="th" scope="row" colSpan={3}>
                            <Tooltip
                              title={`ชุดทดสอบนี้ถูกลบภายหลังจากที่นักศึกษาได้ทำการส่งงานไปแล้ว`}
                            >
                              <Chip
                                className="cursor-pointer"
                                size="small"
                                color="warning"
                                icon={<WarningIcon />}
                                label="ชุดทดสอบนี้ถูกลบไปแล้ว"
                                sx={{ px: 1 }}
                              />
                            </Tooltip>
                          </TableCell>
                        )}

                        <TableCell align="center">
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => handleExpandTestcases(idx)}
                          >
                            {expandTestcases[idx] ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      <TableRow
                        sx={{
                          bgcolor: (theme) =>
                            alpha(
                              testcase.submissionData.status === 3
                                ? theme.palette.success.light
                                : theme.palette.error.light,
                              0.3
                            ),
                        }}
                      >
                        <TableCell
                          colSpan={4}
                          sx={{
                            paddingBottom: 0,
                            paddingTop: 0,
                          }}
                        >
                          <Collapse
                            in={expandTestcases[idx]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ margin: 6 }}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                                align="center"
                              >
                                ผลลัพธ์จากการรันโปรแกรมด้วยชุดทดสอบ{' '}
                                {testcase.name ?? 'ที่ถูกลบไปแล้ว'}
                              </Typography>
                              <Table
                                size="small"
                                aria-label="submission-data"
                                sx={{
                                  '& .MuiTableCell-root': {
                                    border: 'none',
                                  },
                                }}
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="right">เวลา</TableCell>
                                    <TableCell align="right">
                                      หน่วยความจำ
                                    </TableCell>
                                    <TableCell align="center">ผลตรวจ</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow key={testcase.submissionData.id}>
                                    <TableCell align="right">
                                      {testcase.submissionData.time
                                        ? testcase.submissionData.time + ' ms'
                                        : '-'}
                                    </TableCell>
                                    <TableCell align="right">
                                      {testcase.submissionData.memory
                                        ? testcase.submissionData.memory
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ','
                                            ) + ' KB'
                                        : '-'}
                                    </TableCell>
                                    <TableCell align="center">
                                      <GraderStatusChip
                                        statusId={
                                          testcase.submissionData.status
                                        }
                                      />
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </>
      )}
    </>
  );
};

export default SubmissionTestcasesSection;
