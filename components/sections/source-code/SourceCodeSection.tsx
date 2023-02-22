import MarkdownPreview from '@/components/previews/markdown/MarkdownPreview';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { CgCodeSlash } from 'react-icons/cg';

export interface ISourceCodeSection {
  sourceCode: string;
}

const SourceCodeSection: React.FC<ISourceCodeSection> = ({ sourceCode }) => {
  const theme = useTheme();
  const [openSrcSection, setOpenSrcSection] = useState(false);

  const handleOpenSrc = () => {
    setOpenSrcSection(!openSrcSection);
  };

  return (
    <>
      <ListItemButton onClick={handleOpenSrc}>
        <ListItemIcon>
          <CgCodeSlash />
        </ListItemIcon>
        <ListItemText primary="ซอร์สโค้ด" />
        {openSrcSection ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openSrcSection} timeout="auto" unmountOnExit>
        <div data-color-mode={theme.palette.mode}>
          <MarkdownPreview content={'```java\n' + sourceCode + '```'} />
        </div>
      </Collapse>
    </>
  );
};

export default SourceCodeSection;
