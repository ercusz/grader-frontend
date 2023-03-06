import { FileResponse } from '@/types/types';
import { getImagePath } from '@/utils/imagePath';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Collapse,
  Grid,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { MouseEvent, useState } from 'react';
import { CgCodeSlash } from 'react-icons/cg';

export interface IFilesSection {
  files: FileResponse[];
  deletable?: boolean;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (id: number) => void;
  defaultOpen?: boolean;
}

const FilesSection: React.FC<IFilesSection> = ({
  files,
  deletable,
  onDelete,
  defaultOpen = false,
}) => {
  const theme = useTheme();
  const [openFilesSection, setOpenFilesSection] = useState(defaultOpen);
  const [select, setSelect] = useState<number | null>(null);

  const handleOpenFilesSection = () => {
    setOpenFilesSection(!openFilesSection);
  };

  const handleDeleteFile = (e: MouseEvent<HTMLElement>, id: number) => {
    e.stopPropagation();
    e.preventDefault();

    if (onDelete) {
      onDelete(id);
    }

    setSelect(null);
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
              files.map((file) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                  <Card
                    variant="outlined"
                    onClick={() => setSelect(file.id)}
                    sx={{
                      borderColor: theme.palette.divider,
                      borderStyle: 'solid',
                      borderWidth: select === file.id ? 0 : 1,
                      height: '100%',
                      boxShadow:
                        select === file.id
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
                        {deletable && select == file.id && (
                          <Tooltip arrow title="ลบไฟล์นี้">
                            <IconButton
                              onClick={(e) => handleDeleteFile(e, file.id)}
                              sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                my: 1,
                                mx: 1,
                                bgcolor: (theme) =>
                                  alpha(theme.palette.background.paper, 0.24),
                                '&:hover': {
                                  bgcolor: (theme) =>
                                    alpha(theme.palette.error.main, 0.32),
                                },
                              }}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        )}
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
