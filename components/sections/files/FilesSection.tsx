import { UserSubmission } from '@/types/types';
import { getImagePath } from '@/utils/imagePath';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Collapse,
  Grid,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { CgCodeSlash } from 'react-icons/cg';

export interface IFilesSection {
  files: UserSubmission['files'];
}

const FilesSection: React.FC<IFilesSection> = ({ files }) => {
  const theme = useTheme();
  const [openFilesSection, setOpenFilesSection] = useState(false);
  const [select, setSelect] = useState<number | null>(null);

  const handleOpenFilesSection = () => {
    setOpenFilesSection(!openFilesSection);
  };

  return (
    <>
      <ListItemButton onClick={handleOpenFilesSection}>
        <ListItemIcon>
          <CgCodeSlash />
        </ListItemIcon>
        <ListItemText primary="ไฟล์" />
        {openFilesSection ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openFilesSection} timeout="auto" unmountOnExit>
        <Paper
          sx={{
            borderColor: theme.palette.divider,
            borderStyle: 'solid',
            borderWidth: 1,
            padding: theme.spacing(2),
          }}
        >
          <Grid container spacing={2}>
            {files &&
              files.map((file, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                  <Card
                    variant="outlined"
                    onClick={() => setSelect(idx)}
                    sx={{
                      borderColor: theme.palette.divider,
                      borderStyle: 'solid',
                      borderWidth: select === idx ? 0 : 1,
                      height: '100%',
                      boxShadow:
                        select === idx
                          ? `0 0 0 2px ${alpha(
                              theme.palette.primary.main,
                              0.24
                            )}`
                          : 0,
                    }}
                  >
                    <CardActionArea
                      onDoubleClick={() => {
                        window.open(getImagePath(file), '_blank');
                      }}
                      sx={{
                        height: '100%',
                      }}
                    >
                      {file.mime.includes('image') ? (
                        <CardMedia
                          component="img"
                          height="140"
                          image={getImagePath(file)}
                          alt={file.name}
                        />
                      ) : (
                        <CardMedia
                          component="div"
                          sx={{
                            height: 140,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: theme.palette.background.default,
                          }}
                        >
                          <InsertDriveFileIcon
                            sx={{
                              fontSize: 100,
                              color: theme.palette.text.secondary,
                            }}
                          />
                        </CardMedia>
                      )}
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="body1"
                          component="div"
                          noWrap
                        >
                          {file.name}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            {file.ext.substring(1).toUpperCase()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {file.size > 1024
                              ? `${Math.ceil(file.size / 1024)} MB`
                              : `${Math.ceil(file.size)} KB`}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Paper>
      </Collapse>
    </>
  );
};

export default FilesSection;
