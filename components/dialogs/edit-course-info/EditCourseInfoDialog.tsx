import CourseCard from '@/components/cards/course/CourseCard';
import CreateCourseForm from '@/components/forms/create-course-form/CreateCourseForm';
import UploadCoverImageForm from '@/components/forms/upload-cover-image/UploadCoverImageForm';
import { useClassroomSlug } from '@/states/classrooms/useClassrooms';
import { useCourseSlug } from '@/states/courses/useCourses';
import { openEditCourseDialogAtom } from '@/stores/edit-course';
import CloseIcon from '@mui/icons-material/Close';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Typography,
} from '@mui/material';
import { atom, useAtom } from 'jotai';
import { SyntheticEvent, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

export interface IEditCourseInfoDialog {
  classroomSlug?: string;
  courseSlug?: string;
}

const tabsValueAtom = atom('info');

const EditCourseInfoDialog: React.FC<IEditCourseInfoDialog> = ({
  classroomSlug,
  courseSlug,
}) => {
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const { data: course } = useCourseSlug({ slug: courseSlug });
  const [openDialog, setOpenDialog] = useAtom(openEditCourseDialogAtom);
  const [tabsValue, setTabsValue] = useAtom(tabsValueAtom);

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setTabsValue(newValue);
  };

  const courseFormContext = useForm({
    defaultValues: useMemo(() => {
      return {
        name: course?.name,
        code: course?.code,
        semester: course?.semester,
        year: course?.year,
      };
    }, [course]),
  });

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const { watch: courseData } = courseFormContext;

  const handleSubmit = () => {
    let formData = courseData();
    Object.assign(formData, {
      coverImage: acceptedFiles[0],
    });
    alert(JSON.stringify(formData));
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
        {`แก้ไขข้อมูล${classroom ? 'กลุ่มการเรียน' : 'รายวิชา'}`}
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
                <Tab label="รูปหน้าปก" value="cover-img" />
              </TabList>
            )}
          </Box>
          {classroom ? (
            <>
              <TabPanel value="info">ข้อมูลกลุ่มการเรียน</TabPanel>
              <TabPanel value="manage-tas">จัดการผู้ช่วยสอน</TabPanel>
              <TabPanel value="manage-students">จัดการนักศึกษา</TabPanel>
            </>
          ) : (
            <>
              <TabPanel value="info">
                ข้อมูลรายวิชา
                <CreateCourseForm formContext={courseFormContext} />
              </TabPanel>
              <TabPanel value="cover-img">
                <Typography gutterBottom sx={{ mb: 2 }}>
                  อัปโหลดรูปหน้าปก
                </Typography>
                <UploadCoverImageForm
                  acceptedFiles={acceptedFiles}
                  getRootProps={getRootProps}
                  getInputProps={getInputProps}
                />
              </TabPanel>
            </>
          )}
        </TabContext>
      </DialogContent>
      <DialogActions sx={{ p: 0, mx: 5, mb: 3 }}>
        <Button variant="contained" onClick={handleSubmit}>
          แก้ไข
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCourseInfoDialog;
