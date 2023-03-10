import MarkdownPreview from '@/components/previews/markdown/MarkdownPreview';
import FilesSection from '@/components/sections/files/FilesSection';
import { Material } from '@/types/types';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { isFuture, isValid, parseISO } from 'date-fns';
import { AuthorDetails } from '../assignment-content/AssignmentContentCard';

export interface IMaterialContentCard {
  material: Material;
}

const MaterialContentCard: React.FC<IMaterialContentCard> = ({ material }) => {
  const theme = useTheme();

  return (
    <>
      <Card
        className="shadow-xl w-full"
        variant="outlined"
        sx={{ px: 2, py: 4 }}
      >
        <CardHeader
          sx={{ py: 0 }}
          title={
            <Stack direction="row" spacing={2}>
              {isValid(parseISO(material.publishedDate)) &&
                isFuture(parseISO(material.publishedDate)) && (
                  <Tooltip
                    title={
                      'โพสต์นี้จะไม่ปรากฏให้นักศึกษาในคลาสเรียนเห็นจนกว่าจะถึงวันเวลาที่เริ่มการส่งงาน'
                    }
                  >
                    <Chip
                      size="small"
                      color="warning"
                      icon={<InsertDriveFileIcon />}
                      label="DRAFT"
                      variant="outlined"
                    />
                  </Tooltip>
                )}
            </Stack>
          }
        />
        <CardContent className="w-full">
          <Box sx={{ my: 4 }}>
            <Typography
              className="font-extrabold text-center"
              component="h1"
              variant="h4"
              gutterBottom
            >
              {material.title}
            </Typography>
            {material.updateBy && isValid(parseISO(material.updatedAt)) ? (
              <AuthorDetails
                author={material.updateBy}
                date={parseISO(material.updatedAt)}
              />
            ) : (
              <AuthorDetails
                author={material.createBy}
                date={parseISO(material.createdAt)}
              />
            )}
            <Divider sx={{ my: 6 }} />
          </Box>

          <div data-color-mode={theme.palette.mode}>
            <MarkdownPreview content={material.content} />
          </div>

          {material.files && (
            <Box sx={{ mt: 6 }}>
              <FilesSection files={material.files} defaultOpen />
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default MaterialContentCard;
