import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  AppBar,
  Box,
  IconButton,
  Link as MuiLink,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Link from 'next/link';
import { MouseEvent, useState } from 'react';

export type FeedbackHeaderProps = {
  backButton: boolean;
  downloadCurrentAssignmentButton: boolean;
};

export interface IFeedbackHeader
  extends React.ComponentPropsWithoutRef<'header'> {
  classroomSlug?: string;
  props: FeedbackHeaderProps;
  subHeader: React.ReactNode;
}

const FeedbackHeader: React.FC<IFeedbackHeader> = ({
  classroomSlug,
  props,
  subHeader,
}) => {
  const { backButton, downloadCurrentAssignmentButton } = props;
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMoreButtonClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          color: (theme) => theme.palette.text.primary,
          backgroundColor: (theme) => theme.palette.background.default,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          '& .MuiToolbar-root': {
            borderBottom: (theme) =>
              `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
          },
        }}
      >
        <Toolbar>
          {backButton && classroom && (
            <Box sx={{ display: 'flex' }}>
              <Link href={`/classroom/${classroom.slug}/feedbacks`} passHref>
                <MuiLink
                  className="no-underline"
                  component={IconButton}
                  aria-label="back"
                  edge="start"
                  color="inherit"
                >
                  <ArrowBackIcon />
                </MuiLink>
              </Link>
            </Box>
          )}
          {classroom && (
            <Box style={{ display: 'flex', flexGrow: 1 }}>
              <Link href={`/classroom/${classroom.slug}`} passHref>
                <MuiLink className="no-underline" variant="body2">
                  <Tooltip title="ไปยังหน้าคลาสเรียน" arrow>
                    <Stack
                      direction="column"
                      justifyContent="center"
                      sx={{ ml: 2, lineHeight: 1 }}
                    >
                      <Typography variant="caption" noWrap>
                        {classroom.course.name}
                      </Typography>
                      <Typography variant="h6" noWrap>
                        {classroom.name}
                      </Typography>
                    </Stack>
                  </Tooltip>
                </MuiLink>
              </Link>
            </Box>
          )}
          <Box sx={{ display: 'flex', flexGrow: 0 }}>
            <IconButton
              aria-label="more"
              edge="start"
              color="inherit"
              onClick={handleMoreButtonClick}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Toolbar>

        {subHeader}
      </AppBar>

      <Menu
        id="feedback-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'feedback-menu',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          sx={{ pointerEvents: 'none', py: 0, pl: 0, ml: 2, minHeight: 0 }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <DownloadIcon fontSize="inherit" sx={{ mr: 0.2 }} />
            ดาวน์โหลดไฟล์สรุปคะแนน (.CSV)
          </Typography>
        </MenuItem>
        <MenuItem sx={{ justifyContent: 'center' }}>
          งานทั้งหมดในคลาสเรียน
        </MenuItem>
        {downloadCurrentAssignmentButton && (
          <MenuItem sx={{ justifyContent: 'center' }}>เฉพาะงานนี้</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default FeedbackHeader;
