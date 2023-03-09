import FilesSection from '@/components/sections/files/FilesSection';
import { FileResponse, UploadedFile } from '@/types/types';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PrimitiveAtom, useAtom } from 'jotai';
import mime from 'mime-types';
import { CSSProperties, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

export const imageTypes = {
  'image/jpeg': [],
  'image/png': [],
};

export const docsTypes = {
  ...imageTypes,
  'application/pdf': [],
  'application/msword': [],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
  'application/vnd.ms-powerpoint': [],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    [],
  'application/vnd.ms-excel': [],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
  'application/zip': [],
  'application/x-rar-compressed': [],
  'application/x-7z-compressed': [],
};

const hashCode = (str: string) => {
  return str
    .split('')
    .reduce(
      (prevHash, currVal) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0
    );
};

export interface IUploadFileForm {
  filesAtom: PrimitiveAtom<UploadedFile[] | null>;
  maxFiles?: number;
  maxFileSizeMB?: number;
  acceptedFileTypes?: { [key: string]: string[] };
  preview?: boolean;
}

const UploadFileForm: React.FC<IUploadFileForm> = ({
  filesAtom,
  maxFiles = 10,
  maxFileSizeMB = 15,
  preview = true,
  acceptedFileTypes = docsTypes,
}) => {
  const theme = useTheme();
  const [files, setFiles] = useAtom(filesAtom);
  const fileSizeValidation = (file: File) => {
    const fileSize = file.size / 1024 / 1024; // Convert Bytes to MB
    if (fileSize > maxFileSizeMB) {
      return {
        code: 'file-too-large',
        message: `ไฟล์มีขนาดใหญ่กว่า ${maxFileSizeMB} MB`,
      };
    }
    return null;
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFileTypes,
    maxFiles: maxFiles,
    validator: fileSizeValidation,
    onDrop: (acceptedFiles, rejectedFiles) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        // Validate number of files
        const isTooManyFiles = rejectedFiles.some(({ errors }) => {
          if (errors.length > 0) {
            if (errors[0].code === 'too-many-files') {
              return true;
            }
          }
        });

        if (isTooManyFiles) {
          alert('ไฟล์ที่อัปโหลดเกินจำนวนที่กำหนด กรุณาอัปโหลดใหม่อีกครั้ง');
          return;
        }

        // Validate file type
        const invalidFileTypeNames = rejectedFiles
          .filter(({ errors }) => {
            if (errors.length > 0) {
              if (errors[0].code === 'file-invalid-type') {
                return true;
              }
            }
          })
          .map(({ file }) => file.name)
          .join(', ');

        if (invalidFileTypeNames.length > 0) {
          alert(
            `พบไฟล์ที่ไม่รองรับ ได้แก่ ${invalidFileTypeNames} กรุณาอัปโหลดใหม่อีกครั้ง`
          );
          return;
        }

        // Validate file size
        const largeFiles = rejectedFiles
          .filter(({ errors }) => {
            if (errors.length > 0) {
              if (errors[0].code === 'file-too-large') {
                return true;
              }
            }
          })
          .map(({ file }) => file.name)
          .join(', ');

        if (largeFiles.length > 0) {
          alert(
            `พบไฟล์ที่มีขนาดใหญ่กว่า ${maxFileSizeMB} MB ได้แก่ ${largeFiles} กรุณาอัปโหลดใหม่อีกครั้ง`
          );
          return;
        }

        alert('พบข้อผิดพลาดในการอัปโหลดไฟล์ กรุณาลองอีกครั้ง');
        return;
      }

      const uploadedFiles: Array<FileResponse & { fileObj: File }> | null =
        acceptedFiles.map((file) => {
          return {
            id:
              hashCode(file.name) +
              new Date().valueOf() +
              Math.floor(Math.random()),
            name: file.name,
            url: URL.createObjectURL(file),
            ext: file.name.slice(file.name.lastIndexOf('.')),
            mime: file.type,
            size: file.size / 1024, // Convert Bytes to KB
            createdAt: new Date().toISOString(),
            fileObj: file,
          };
        });

      if (files && files.length + uploadedFiles.length > maxFiles) {
        alert(
          `ไฟล์ที่อัปโหลดเกินจำนวนที่กำหนด กรุณาลบไฟล์เก่าและอัปโหลดใหม่อีกครั้ง`
        );
        return;
      }

      setFiles(
        (prevFiles) => prevFiles?.concat(uploadedFiles) || uploadedFiles || null
      );
    },
  });

  const style: CSSProperties = useMemo(
    () => ({
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      padding: '20px',
      borderWidth: 1,
      borderRadius: 2,
      borderColor: theme.palette.text.primary,
      borderStyle: 'dashed',
      backgroundColor: 'transparent',
      color: theme.palette.text.primary,
      outline: 'none',
      transition: 'border .24s ease-in-out',
      cursor: 'pointer',
    }),
    [theme.palette.text.primary]
  );

  const onDelete = (id: number) => {
    if (files) {
      const newFiles = files.filter((file) => file.id !== id);
      setFiles(newFiles);
    }
  };

  const exts = useMemo(() => {
    const mimeTypes = Object.keys(acceptedFileTypes);

    return mimeTypes
      .map((mimeType) => '.' + mime.extension(mimeType))
      .join(', ');
  }, [acceptedFileTypes]);

  return (
    <>
      {/* Drag & Drop Upload Zone */}
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          mb: 1,
        }}
      >
        <Box {...getRootProps({ style })} className="text-center w-full">
          <input {...getInputProps()} />
          <CloudUploadIcon fontSize="large" />
          <Typography variant="h6">
            ลากไฟล์มาวางในกล่องนี้ หรือคลิกเพื่อเลือกไฟล์
          </Typography>
          <Typography variant="body2" color="textSecondary">
            สามารถอัปโหลดได้สูงสุด {maxFiles} ไฟล์ ขนาดสูงสุด {maxFileSizeMB}{' '}
            MB/ไฟล์
          </Typography>
          <Typography variant="body2" color="textSecondary">
            รองรับไฟล์ {exts} เท่านั้น
          </Typography>
        </Box>
      </Paper>

      {/* Preview Files */}
      <Stack direction="column" spacing={1}>
        {preview && files && files.length > 0 && (
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <FilesSection
              deletable
              onDelete={onDelete}
              defaultOpen
              files={files}
            />
          </Paper>
        )}
      </Stack>
    </>
  );
};

export default UploadFileForm;
