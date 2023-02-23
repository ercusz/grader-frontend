import GraderStatusChip from '@/components/chips/grader-status/GraderStatusChip';
import { UserJavaSrcSubmission } from '@/types/types';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Collapse,
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
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useState } from 'react';
import { ImLab } from 'react-icons/im';

export interface ICompactSubmissionTestcasesSection {
  testcases: UserJavaSrcSubmission['testcases'];
}

const CompactSubmissionTestcasesSection: React.FC<
  ICompactSubmissionTestcasesSection
> = ({ testcases }) => {
  const [openTestcasesSection, setOpenTestcasesSection] = useState(false);

  const handleOpenTestcasesSection = () => {
    setOpenTestcasesSection(!openTestcasesSection);
  };

  return (
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
                <TableCell align="right">เวลา</TableCell>
                <TableCell align="right">หน่วยความจำ</TableCell>
                <TableCell align="center">ผลตรวจ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testcases.map((testcase, idx) => (
                <TableRow
                  key={testcase.id}
                  sx={{
                    backgroundColor: (theme) =>
                      alpha(
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
                    {testcase.time ? testcase.time + ' ms' : '-'}
                  </TableCell>
                  <TableCell align="right">
                    {testcase.memory
                      ? testcase.memory
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' KB'
                      : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <GraderStatusChip statusId={testcase.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </>
  );
};

export default CompactSubmissionTestcasesSection;
