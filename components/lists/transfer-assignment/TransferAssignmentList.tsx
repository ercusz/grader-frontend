import { defaultLeftAtom, defaultRightAtom } from '@/stores/edit-topic';
import { Assignment } from '@/types/types';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useState } from 'react';

function not(a: Assignment[], b: Assignment[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: Assignment[], b: Assignment[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: Assignment[], b: Assignment[]) {
  return [...a, ...not(b, a)];
}

export interface ITransferAssignmentList {}

const TransferAssignmentList: React.FC<ITransferAssignmentList> = () => {
  const [checked, setChecked] = useState<Assignment[]>([]);
  const [left, setLeft] = useAtom(defaultLeftAtom);
  const [right, setRight] = useAtom(defaultRightAtom);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: Assignment) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: Assignment[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: Assignment[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: Assignment[]) => (
    <Card variant="outlined">
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'งานทั้งหมดถูกเลือกแล้ว',
            }}
          />
        }
        title={title}
        subheader={`เลือก ${numberOfChecked(items)}/${items.length} งาน`}
      />
      <Divider />
      <List
        sx={{
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: Assignment) => {
          return (
            value && (
              <ListItemButton
                key={value.id}
                role="listitem"
                onClick={handleToggle(value)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      'aria-labelledby': value.id.toString(),
                    }}
                  />
                </ListItemIcon>
                <ListItemText id={value.id.toString()} primary={value.title} />
              </ListItemButton>
            )
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid item xs={5} md={5}>
        {customList('ไม่อยู่ในหัวข้อนี้', left)}
      </Grid>
      <Grid item xs={2} md={2}>
        <Stack direction="column" alignItems="center">
          <Tooltip title="เพิ่มไปยังหัวข้อ" arrow placement="top">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="เพิ่มไปยังหัวข้อ"
              color="success"
            >
              <ChevronRightIcon fontSize="large" />
            </Button>
          </Tooltip>
          <Tooltip title="นำออกจากหัวข้อ" arrow placement="bottom">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="นำออกจากหัวข้อ"
              color="error"
            >
              <ChevronLeftIcon fontSize="large" />
            </Button>
          </Tooltip>
        </Stack>
      </Grid>
      <Grid item xs={5} md={5}>
        {customList('อยู่ในหัวข้อนี้', right)}
      </Grid>
    </Grid>
  );
};

export default TransferAssignmentList;
