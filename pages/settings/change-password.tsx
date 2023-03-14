import SettingsLayout from '@/components/layouts/settings/SettingsLayout';
import { useUser } from '@/hooks/user/useUser';
import { ChangePassword as ChangePasswordType } from '@/types/types';
import { changePassword } from '@/utils/UserService';
import { Button, FormHelperText, Grid } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FormContainer, PasswordElement, useForm } from 'react-hook-form-mui';
import { NextPageWithLayout } from '../page';

const ChangePassword: NextPageWithLayout = () => {
  const { data: user } = useUser();
  const router = useRouter();

  const formContext = useForm();

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (body: ChangePasswordType) => changePassword(body),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['users']);
        alert('แก้ไขรหัสผ่านสำเร็จ');
        const data = await signOut({
          redirect: false,
          callbackUrl: '/auth/sign-in',
        });
        router.push(data.url);
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการแก้ไขรหัสผ่าน');
      },
    }
  );

  const onSubmit = () => {
    const { currentPassword, newPassword, confirmNewPassword } =
      formContext.getValues();
    const body: ChangePasswordType = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    };

    mutation.mutate(body);
  };

  return user ? (
    <section>
      <FormContainer formContext={formContext} onSuccess={onSubmit}>
        <Grid
          container
          direction={{ xs: 'column', sm: 'row' }}
          columnSpacing={{ xs: 0, sm: 2 }}
          rowSpacing={2}
          alignItems="flex-start"
          sx={{
            width: '100%',
            m: 0,
            p: 0,
            '& .MuiFormHelperText-root': {
              fontSize: '1rem',
              mx: 0,
            },
            '& .MuiGrid-item': {
              width: '100%',
            },
          }}
        >
          <Grid item xs={12} sm={12} md={6}>
            <FormHelperText>รหัสผ่านปัจจุบัน</FormHelperText>
            <PasswordElement
              name="currentPassword"
              fullWidth
              size="small"
              required
              validation={{
                required: {
                  value: true,
                  message: `คุณจำเป็นต้องกรอกรหัสผ่านปัจจุบัน`,
                },
                min: {
                  value: 6,
                  message: `รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร`,
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <FormHelperText>รหัสผ่านใหม่</FormHelperText>
            <PasswordElement
              name="newPassword"
              fullWidth
              size="small"
              required
              validation={{
                required: {
                  value: true,
                  message: `คุณจำเป็นต้องกรอกรหัสผ่านใหม่`,
                },
                min: {
                  value: 6,
                  message: `รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร`,
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <FormHelperText>ยืนยันรหัสผ่านใหม่</FormHelperText>
            <PasswordElement
              name="confirmNewPassword"
              fullWidth
              size="small"
              required
              validation={{
                required: {
                  value: true,
                  message: `คุณจำเป็นต้องกรอกรหัสผ่านใหม่อีกครั้ง`,
                },
                min: {
                  value: 6,
                  message: `รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร`,
                },
                validate: (value) => {
                  if (value !== formContext.getValues().newPassword) {
                    return `รหัสผ่านไม่ตรงกัน`;
                  }
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              เปลี่ยนรหัสผ่าน
            </Button>
          </Grid>
        </Grid>
      </FormContainer>
    </section>
  ) : null;
};

export default ChangePassword;

ChangePassword.getLayout = (page) => {
  return <SettingsLayout title="จัดการโปรไฟล์">{page}</SettingsLayout>;
};
