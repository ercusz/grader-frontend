import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import { CSSProperties, useMemo } from 'react';
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';

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
  acceptedFiles: File[];
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
}

const UploadCoverImageForm: React.FC<IUploadCoverImageForm> = ({
  acceptedFiles,
  getRootProps,
  getInputProps,
}) => {
  const style: CSSProperties = useMemo(
    () => ({
      ...baseStyle,
    }),
    []
  );

  const files = acceptedFiles.map((file: any) => (
    <li className="pl-4" key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <Container className="w-full px-0">
      <Box {...getRootProps({ style })} className="text-center w-full">
        <input {...getInputProps()} />
        <CloudUploadIcon fontSize="large" />
        <Typography variant="h6">
          ลากไฟล์มาวางในกล่องนี้ หรือคลิกเพื่อเลือกไฟล์
        </Typography>
      </Box>
      {acceptedFiles[0] && (
        <>
          <Typography variant="caption">ไฟล์: {files}</Typography>
          <Box className="relative h-[136px] mt-4">
            <Image
              className="w-full object-cover rounded-2xl"
              layout="fill"
              quality={60}
              alt="preview-cover-image"
              src={URL.createObjectURL(acceptedFiles[0])}
              sizes="100vw"
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default UploadCoverImageForm;
