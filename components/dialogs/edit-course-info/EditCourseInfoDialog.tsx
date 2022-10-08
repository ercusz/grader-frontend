import { useClassroomSlug } from '@/states/classrooms/useClassrooms';
import { openEditCourseDialogAtom } from '@/stores/edit-course';
import CloseIcon from '@mui/icons-material/Close';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
} from '@mui/material';
import { atom, useAtom } from 'jotai';
import { SyntheticEvent } from 'react';

export interface IEditCourseInfoDialog {
  classroomSlug?: string;
}
const tabsValueAtom = atom('classroom-info');

const EditCourseInfoDialog: React.FC<IEditCourseInfoDialog> = ({
  classroomSlug,
}) => {
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const [openDialog, setOpenDialog] = useAtom(openEditCourseDialogAtom);
  const [tabsValue, setTabsValue] = useAtom(tabsValueAtom);

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setTabsValue(newValue);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={openDialog}
      onClose={() => {
        setOpenDialog(false);
      }}
      aria-labelledby="invite-code-dialog"
      sx={{
        borderRadius: '20px',
      }}
    >
      <DialogTitle id="invite-code-dialog">
        แก้ไขข้อมูลรายวิชา
        <IconButton
          aria-label="close"
          onClick={() => setOpenDialog(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TabContext value={tabsValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            {classroom ? (
              <TabList
                onChange={handleTabChange}
                aria-label="edit-classroom-info-tabs"
              >
                <Tab label="ข้อมูลกลุ่มการเรียน" value="classroom-info" />
                <Tab label="จัดการผู้ช่วยสอน" value="manage-tas" />
                <Tab label="จัดการนักศึกษา" value="manage-students" />
              </TabList>
            ) : (
              <TabList
                onChange={handleTabChange}
                aria-label="edit-classroom-info-tabs"
              >
                <Tab label="ข้อมูลรายวิชา" value="course-info" />
              </TabList>
            )}
          </Box>
          {classroom ? (
            <>
              <TabPanel value="classroom-info">ข้อมูลกลุ่มการเรียน</TabPanel>
              <TabPanel value="manage-tas">จัดการผู้ช่วยสอน</TabPanel>
              <TabPanel value="manage-students">จัดการนักศึกษา</TabPanel>
            </>
          ) : (
            <TabPanel value="course-info">ข้อมูลรายวิชา</TabPanel>
          )}
        </TabContext>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default EditCourseInfoDialog;
