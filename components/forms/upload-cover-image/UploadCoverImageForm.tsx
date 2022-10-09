import { unsavedChangesAtom } from '@/components/dialogs/edit-course-info/EditCourseInfoDialog';
import { useCourseSlug } from '@/states/courses/useCourses';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Container, Divider, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { CSSProperties, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column' as 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: 'transparent',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

export interface IUploadCoverImageForm {
  courseSlug: string;
}

const PreviewImage = ({ src }: { src: string }) => {
  return (
    <Box className="relative h-[187px] mt-4">
      <Image
        className="w-full object-cover rounded-2xl"
        layout="fill"
        quality={60}
        alt="preview-cover-image"
        src={src}
        sizes="100vw"
      />
    </Box>
  );
};

const numberWithCommas = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const UploadCoverImageForm: React.FC<IUploadCoverImageForm> = ({
  courseSlug,
}) => {
  const { data: course } = useCourseSlug({ slug: courseSlug });
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
  });
  const [_, setUnsavedChanges] = useAtom(unsavedChangesAtom);

  const style: CSSProperties = useMemo(
    () => ({
      ...baseStyle,
    }),
    []
  );

  useEffect(() => {
    setUnsavedChanges(acceptedFiles[0] !== undefined);
  }, [acceptedFiles, setUnsavedChanges]);

  const handleUpdateCoverImage = () => {
    alert(acceptedFiles[0].name);
    setUnsavedChanges(false);
  };

  return (
    <Container className="w-full px-0">
      <Box {...getRootProps({ style })} className="text-center w-full">
        <input {...getInputProps()} />
        <CloudUploadIcon fontSize="large" />
        <Typography variant="h6">
          ลากไฟล์มาวางในกล่องนี้ หรือคลิกเพื่อเลือกไฟล์
        </Typography>
      </Box>
      {acceptedFiles[0] ? (
        <>
          <Typography variant="caption" noWrap>
            {`ไฟล์: ${acceptedFiles[0].name} - ${numberWithCommas(
              acceptedFiles[0].size
            )} bytes`}
          </Typography>
          <Divider sx={{ mt: 2 }} />
          <PreviewImage src={URL.createObjectURL(acceptedFiles[0])} />
          <Button
            variant="contained"
            onClick={handleUpdateCoverImage}
            sx={{ my: 3 }}
          >
            อัปเดตรูปภาพหน้าปก
          </Button>
        </>
      ) : (
        course?.coverImage && (
          <>
            <Divider sx={{ my: 4 }} />
            <Typography className="font-bold" variant="body1" noWrap>
              รูปภาพหน้าปกปัจจุบัน
            </Typography>
            <PreviewImage src={course.coverImage.url} />
          </>
        )
      )}
    </Container>
  );
};

export default UploadCoverImageForm;
