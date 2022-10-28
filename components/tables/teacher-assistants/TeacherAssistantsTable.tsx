import AddTeacherAssistantDialog from '@/components/dialogs/add-teacher-assistant/AddTeacherAssistantDialog';
import { useClassroomSlug } from '@/states/classrooms/useClassrooms';
import { UserResponse } from '@/types/types';
import {
  removeTaFromClassroom,
  removeTasFromClassroom,
} from '@/utils/ClassroomService';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table';
import { useMemo } from 'react';

export interface ITeacherAssistantsTable {
  classroomSlug: string;
}

const openAddTaDialogAtom = atom(false);

const TeacherAssistantsTable: React.FC<ITeacherAssistantsTable> = ({
  classroomSlug,
}) => {
  const { isError, data: classroom } = useClassroomSlug({
    slug: classroomSlug,
  });
  const [openAddTaDialog, setOpenAddTaDialog] = useAtom(openAddTaDialogAtom);

  const queryClient = useQueryClient();
  const deleteTaMutation = useMutation(
    (taId: number) => removeTaFromClassroom(taId, classroom?.id as number),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['classroom', { slug: classroom?.slug }]);
        alert('ลบผู้ช่วยสอนออกจากคลาสเรียนสำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลบผู้ช่วยสอนออกจากคลาสเรียน');
      },
    }
  );

  const deleteTasMutation = useMutation(
    (tas: UserResponse[]) =>
      removeTasFromClassroom(tas, classroom?.id as number),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['classroom', { slug: classroom?.slug }]);
        alert('ลบผู้ช่วยสอนที่เลือกออกจากคลาสเรียนสำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลบผู้ช่วยสอนออกจากคลาสเรียน');
      },
    }
  );
  const handleDeleteTa = (row: MRT_Row<UserResponse>) => {
    if (
      confirm(
        `ต้องการลบผู้ช่วยสอน\n\nชื่อ: ${row.getValue(
          'name'
        )}\nชื่อผู้ใช้: ${row.getValue('username')}\n\nออกจากคลาสเรียนหรือไม่?`
      )
    ) {
      deleteTaMutation.mutate(row.original.id);
    }
  };

  const handleDeleteTas = (students: UserResponse[]) => {
    if (
      confirm(
        `ต้องการลบผู้ช่วยสอน\nจำนวน ${students.length} คน\nออกจากคลาสเรียนหรือไม่?`
      )
    ) {
      deleteTasMutation.mutate(students);
    }
  };

  const getTaName = (ta: UserResponse) => {
    if (ta.firstName && ta.lastName) {
      return `${ta.firstName} ${ta.lastName}`;
    }

    return 'ยังไม่ตั้งชื่อ';
  };

  const columns = useMemo<MRT_ColumnDef<UserResponse>[]>(
    () => [
      {
        accessorFn: (row) => getTaName(row),
        id: 'name',
        header: 'ชื่อ - สกุล',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <Avatar
              alt={getTaName(row.original)}
              src={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${row.original.profileImage?.url}`}
            />
            <Typography>{cell.getValue<string>()}</Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'username',
        header: 'ชื่อผู้ใช้',
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={classroom?.teacherAssistants ?? []}
      enableGlobalFilter
      enableDensityToggle={false}
      enableFullScreenToggle={false}
      initialState={{ showColumnFilters: false, density: 'compact' }}
      enableRowActions
      positionActionsColumn="last"
      enableRowSelection
      enableStickyFooter
      enableStickyHeader
      muiToolbarAlertBannerProps={
        isError
          ? {
              color: 'error',
              children: 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
            }
          : undefined
      }
      muiTablePaperProps={{
        sx: {
          bgcolor: 'transparent',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        },
      }}
      muiBottomToolbarProps={{
        sx: {
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          marginBottom: 4,
        },
      }}
      renderRowActionMenuItems={({ row, closeMenu }) => [
        <MenuItem
          key={0}
          onClick={() => {
            closeMenu();
            handleDeleteTa(row);
          }}
          sx={{ m: 0 }}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          ลบ
        </MenuItem>,
      ]}
      renderTopToolbarCustomActions={({ table }) => {
        const handleRemoveSelected = () => {
          const tas = table
            .getSelectedRowModel()
            .flatRows.map(({ original }) => original);
          handleDeleteTas(tas);
        };

        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <AddTeacherAssistantDialog
              classroomSlug={classroomSlug}
              open={openAddTaDialog}
              handleClose={() => setOpenAddTaDialog(false)}
            />
            <Button
              color="success"
              onClick={() => setOpenAddTaDialog(true)}
              variant="outlined"
            >
              เพิ่มผู้ช่วยสอน
            </Button>
            {table.getSelectedRowModel().flatRows.length > 0 && (
              <Button
                color="error"
                disabled={table.getSelectedRowModel().flatRows.length === 0}
                onClick={handleRemoveSelected}
                variant="outlined"
              >
                ลบที่เลือก
              </Button>
            )}
          </div>
        );
      }}
    />
  );
};

export default TeacherAssistantsTable;
