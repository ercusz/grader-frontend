import { useClassroomSlug } from '@/states/classrooms/useClassrooms';
import { UserResponse } from '@/types/types';
import {
  removeStudentFromClassroom,
  removeStudentsFromClassroom,
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
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table';
import { useMemo } from 'react';

export interface IStudentsTable {
  classroomSlug: string;
}

const StudentsTable: React.FC<IStudentsTable> = ({ classroomSlug }) => {
  const { isError, data: classroom } = useClassroomSlug({
    slug: classroomSlug,
  });

  const queryClient = useQueryClient();
  const deleteStudentMutation = useMutation(
    (studentId: number) =>
      removeStudentFromClassroom(studentId, classroom?.id as number),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['classroom', { slug: classroom?.slug }]);
        alert('ลบนักศึกษาออกจากคลาสเรียนสำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลบนักศึกษาออกจากคลาสเรียน');
      },
    }
  );

  const deleteStudentsMutation = useMutation(
    (students: UserResponse[]) =>
      removeStudentsFromClassroom(students, classroom?.id as number),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['classroom', { slug: classroom?.slug }]);
        alert('ลบนักศึกษาที่เลือกออกจากคลาสเรียนสำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลบนักศึกษาออกจากคลาสเรียน');
      },
    }
  );
  const handleDeleteStudent = (row: MRT_Row<UserResponse>) => {
    if (
      confirm(
        `ต้องการลบนักศึกษา\n\nชื่อ: ${row.getValue(
          'name'
        )}\nชื่อผู้ใช้: ${row.getValue('username')}\n\nออกจากคลาสเรียนหรือไม่?`
      )
    ) {
      deleteStudentMutation.mutate(row.original.id);
    }
  };

  const handleDeleteStudents = (students: UserResponse[]) => {
    if (
      confirm(
        `ต้องการลบนักศึกษา\nจำนวน ${students.length} คน\nออกจากคลาสเรียนหรือไม่?`
      )
    ) {
      deleteStudentsMutation.mutate(students);
    }
  };

  const getStudentName = (student: UserResponse) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }

    return 'ยังไม่ตั้งชื่อ';
  };

  const columns = useMemo<MRT_ColumnDef<UserResponse>[]>(
    () => [
      {
        accessorFn: (student) => getStudentName(student),
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
              alt={getStudentName(row.original)}
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
      data={classroom?.students ?? []}
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
            handleDeleteStudent(row);
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
          const students = table
            .getSelectedRowModel()
            .flatRows.map(({ original }) => original);
          handleDeleteStudents(students);
        };

        const handleAdd = () => {
          alert('add teacher assistant action');
        };

        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button color="success" onClick={handleAdd} variant="outlined">
              เชิญนักศึกษา
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

export default StudentsTable;
