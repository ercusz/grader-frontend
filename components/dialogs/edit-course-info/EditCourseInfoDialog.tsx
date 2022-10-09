import EditClassroomInfoForm from '@/components/forms/edit-classroom-info/EditClassroomInfoForm';
import EditCourseInfoForm from '@/components/forms/edit-course-info/EditCourseInfoForm';
import UploadCoverImageForm from '@/components/forms/upload-cover-image/UploadCoverImageForm';
import TeacherAssistantsTable from '@/components/tables/teacher-assistants-table/TeacherAssistantsTable';
import { openEditCourseDialogAtom } from '@/stores/edit-course';
import CloseIcon from '@mui/icons-material/Close';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Typography,
} from '@mui/material';
import { atom, useAtom } from 'jotai';
import { SyntheticEvent } from 'react';

export interface IEditCourseInfoDialog {
  classroomSlug?: string;
  courseSlug?: string;
}

const tabsValueAtom = atom('info');
export const unsavedChangesAtom = atom(false);

const EditCourseInfoDialog: React.FC<IEditCourseInfoDialog> = ({
  classroomSlug,
  courseSlug,
}) => {
  const [openDialog, setOpenDialog] = useAtom(openEditCourseDialogAtom);
  const [tabsValue, setTabsValue] = useAtom(tabsValueAtom);
  const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom);

  const openUnsavedChangesDialog = (callback: () => void) => {
    if (unsavedChanges) {
      if (
        !confirm(
          'ข้อมูลที่คุณได้แก้ไขยังไม่ถูกบันทึก \nคุณต้องการออกจากหน้านี้ใช่หรือไม่?'
        )
      ) {
        return;
      }

      setUnsavedChanges(false);
    }

    callback();
  };

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    openUnsavedChangesDialog(() => setTabsValue(newValue));
  };

  const handleCloseDialog = () => {
    openUnsavedChangesDialog(() => {
      setOpenDialog(false);
      setTabsValue('info');
    });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="invite-code-dialog"
      sx={{
        borderRadius: '20px',
      }}
    >
      <DialogTitle id="invite-code-dialog">
        {`แก้ไขข้อมูล${classroomSlug ? 'กลุ่มการเรียน' : 'รายวิชา'}`}
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
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
            {classroomSlug ? (
              <TabList
                onChange={handleTabChange}
                aria-label="edit-classroom-info-tabs"
              >
                <Tab label="ข้อมูลกลุ่มการเรียน" value="info" />
                <Tab label="จัดการผู้ช่วยสอน" value="manage-tas" />
                <Tab label="จัดการนักศึกษา" value="manage-students" />
              </TabList>
            ) : (
              <TabList
                onChange={handleTabChange}
                aria-label="edit-course-info-tabs"
              >
                <Tab label="ข้อมูลรายวิชา" value="info" />
                <Tab label="รูปภาพหน้าปก" value="cover-img" />
              </TabList>
            )}
          </Box>
          {classroomSlug ? (
            <>
              <TabPanel value="info">
                ข้อมูลกลุ่มการเรียน
                <EditClassroomInfoForm classroomSlug={classroomSlug!} />
              </TabPanel>
              <TabPanel value="manage-tas" sx={{ p: 0, m: 0 }}>
                <TeacherAssistantsTable classroomSlug={classroomSlug!} />
              </TabPanel>
              <TabPanel value="manage-students">จัดการนักศึกษา</TabPanel>
            </>
          ) : (
            <>
              <TabPanel value="info">
                ข้อมูลรายวิชา
                <EditCourseInfoForm courseSlug={courseSlug!} />
              </TabPanel>
              <TabPanel value="cover-img">
                <Typography gutterBottom sx={{ mb: 2 }}>
                  อัปโหลดรูปภาพหน้าปก
                </Typography>
                <UploadCoverImageForm courseSlug={courseSlug!} />
              </TabPanel>
            </>
          )}
        </TabContext>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseInfoDialog;
