import {
  Backdrop,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import { ReactNode, useState } from 'react';

export type Action = {
  icon: ReactNode;
  name: string;
  onClick: () => void;
};

export interface IPlaygroundSpeedDialButton {
  actions: Action[];
}

const PlaygroundSpeedDialButton: React.FC<IPlaygroundSpeedDialButton> = ({
  actions,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Backdrop open={open} sx={{ zIndex: 999 }} />
      <SpeedDial
        ariaLabel="Playground Speed Dial"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action: Action) => (
          <SpeedDialAction
            key={action.name}
            icon={
              <>
                {action.icon}
                {action.name}
              </>
            }
            onClick={action.onClick}
            FabProps={{ variant: 'extended', size: 'medium' }}
          />
        ))}
      </SpeedDial>
    </>
  );
};

export default PlaygroundSpeedDialButton;
