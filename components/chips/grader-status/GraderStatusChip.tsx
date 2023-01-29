import { compileStatus } from '@/constants/compileStatuses';
import { Chip } from '@mui/material';

export interface IGraderStatusChip {
  statusId: number;
}

const GraderStatusChip: React.FC<IGraderStatusChip> = ({ statusId }) => {
  const getBgColorAndLabel = (statusId: number) => {
    const status = compileStatus.find((obj) => obj.id === statusId);
    return {
      bgColor: `${status ? status.color : compileStatus[0].color}.main`,
      label: status ? status.description : compileStatus[0].description,
    };
  };
  const { bgColor, label } = getBgColorAndLabel(statusId);

  return (
    <Chip
      className="font-bold"
      sx={{
        bgcolor: bgColor,
        color: 'white',
      }}
      size="small"
      label={label}
    />
  );
};

export default GraderStatusChip;
