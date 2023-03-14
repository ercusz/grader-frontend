import SettingsLayout from '@/components/layouts/settings/SettingsLayout';
import { useUser } from '@/hooks/user/useUser';
import { UpdateUserProfile } from '@/types/types';
import { imageExtensions, isValidFileUploaded } from '@/utils/UploadService';
import { updateUserProfile } from '@/utils/UserService';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import {
  Avatar,
  Button,
  Divider,
  FormHelperText,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { NextPageWithLayout } from '../page';

const Profile: NextPageWithLayout = () => {
  const { data: user } = useUser();

  const formContext = useForm();

  const { setValue, register, watch } = formContext;

  const profileImage = watch('profileImage');

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (body: UpdateUserProfile) => updateUserProfile(body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
        alert('แก้ไขโปรไฟล์สำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการแก้ไขโปรไฟล์');
      },
    }
  );

  const onSubmit = () => {
    const body: UpdateUserProfile = {
      ...formContext.getValues(),
      profileImage: getProfileImage(),
    };

    mutation.mutate(body);
  };

  const getProfileImage = () => {
    if (profileImage === null) {
      return null;
    }

    if (profileImage) {
      return profileImage;
    }

    return undefined;
  };

  const getProfileAvatar = () => {
    if (profileImage === undefined) {
      if (user?.profileImage) {
        return user.profileImage.url;
      }
    }

    if (profileImage === null) {
      return undefined;
    }

    if (profileImage) {
      return URL.createObjectURL(profileImage);
    }
  };

  useEffect(() => {
    if (user) {
      setValue('username', user.username);
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      setValue('studentId', user.studentId);
      setValue('contactEmail', user.contactEmail);
      setValue('phoneNumber', user.phoneNumber);
      setValue('bio', user.bio);
      setValue('profileImage', undefined);
    }
  }, [setValue, user]);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!isValidFileUploaded(file, imageExtensions)) {
        alert('ไฟล์ที่อัปโหลดไม่ใช่รูปภาพ');
        return;
      }

      if (file.size > 1024 * 1024 * 5) {
        alert('ไฟล์ที่อัพโหลดมีขนาดใหญ่เกินไป');
        return;
      }

      setValue('profileImage', file);
    }
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
          {/* Profile Image */}
          <Grid item xs={12}>
            <FormHelperText
              sx={{
                fontSize: '1rem',
              }}
            >
              รูปโปรไฟล์
            </FormHelperText>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                alt={user ? `${user?.username}'s profile image` : undefined}
                src={getProfileAvatar()}
                sx={{ width: { xs: 48, sm: 64 }, height: { xs: 48, sm: 64 } }}
              >
                {user && user.firstName && user.lastName
                  ? user.firstName?.charAt(0) + user.lastName?.charAt(0)
                  : user.username?.charAt(0)}
              </Avatar>
              <Button variant="contained" color="primary" component="label">
                <input
                  type="file"
                  {...register('profileImage')}
                  hidden
                  accept={imageExtensions.map((ext) => `.${ext}`).join(',')}
                  onChange={onChangeFile}
                />
                อัปโหลด
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setValue('profileImage', null);
                }}
              >
                ลบรูปโปรไฟล์
              </Button>
            </Stack>
          </Grid>

          <Divider
            sx={{
              my: 2,
            }}
          />

          {/* Email */}
          <Grid item xs={12} sm={12} md={6}>
            <FormHelperText>อีเมล</FormHelperText>
            <Tooltip arrow title="ไม่สามารถแก้ไขอีเมลได้">
              <TextField
                size="small"
                disabled
                value={user.email}
                autoComplete="off"
                fullWidth
                sx={{
                  input: { cursor: 'not-allowed' },
                }}
              />
            </Tooltip>
          </Grid>

          {/* Username */}
          <Grid item xs={12} sm={12} md={6}>
            <FormHelperText>ชื่อผู้ใช้</FormHelperText>
            <TextFieldElement
              name="username"
              placeholder={user.username}
              autoComplete="off"
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailIcon fontSize="inherit" />
                  </InputAdornment>
                ),
              }}
              validation={{
                required: {
                  value: true,
                  message: 'คุณจำเป็นต้องกรอก ชื่อผู้ใช้',
                },
                pattern: {
                  value: /^[a-z0-9_-]{4,20}$/,
                  message:
                    'กรุณากรอก ชื่อผู้ใช้ ให้ถูกต้อง ตาม format ดังนี้ \n ตัวอักษรภาษาอังกฤษพิมพ์เล็ก-ใหญ่ ตัวเลข 0-9 ขีด(-) ขีดล่าง(_) \n ความยาวตั้งแต่ 6-20 ตัว',
                },
              }}
            />
          </Grid>

          {/* First Name */}
          <Grid item xs={12} sm={12} md={6}>
            <FormHelperText>ชื่อ</FormHelperText>
            <TextFieldElement
              name="firstName"
              placeholder={user.firstName ?? ''}
              autoComplete="off"
              fullWidth
              size="small"
              validation={{
                required: 'กรุณากรอกชื่อ',
                pattern: {
                  value: /^[ก-๙a-zA-Z]+$/,
                  message: 'กรุณากรอกชื่อให้ถูกต้อง',
                },
              }}
            />
          </Grid>

          {/* Last Name */}
          <Grid item xs={12} sm={12} md={6}>
            <FormHelperText>นามสกุล</FormHelperText>
            <TextFieldElement
              name="lastName"
              placeholder={user.lastName ?? ''}
              autoComplete="off"
              fullWidth
              size="small"
              validation={{
                required: 'กรุณากรอกชื่อ',
                pattern: {
                  value: /^[ก-๙a-zA-Z]+$/,
                  message: 'กรุณากรอกชื่อให้ถูกต้อง',
                },
              }}
            />
          </Grid>

          {/* Contact Email */}
          <Grid item xs={12} sm={12} md={6}>
            <FormHelperText>อีเมลสำหรับติดต่อ</FormHelperText>
            <TextFieldElement
              name="contactEmail"
              placeholder={user.contactEmail ?? ''}
              autoComplete="off"
              fullWidth
              size="small"
              type="email"
              validation={{
                pattern: {
                  value: /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/,
                  message: 'กรุณากรอกอีเมลให้ถูกต้อง',
                },
              }}
            />
          </Grid>

          {/* Phone Number */}
          <Grid item xs={12} sm={12} md={6}>
            <FormHelperText>เบอร์ติดต่อ</FormHelperText>
            <TextFieldElement
              name="phoneNumber"
              placeholder={user.phoneNumber ?? ''}
              autoComplete="off"
              fullWidth
              size="small"
              validation={{
                pattern: {
                  value: /^[0-9]{9,10}$/,
                  message: 'กรุณากรอกเบอร์โทรให้ถูกต้อง',
                },
              }}
            />
          </Grid>

          {user.role.name.toLocaleLowerCase() === 'student' && (
            /* Student ID */
            <Grid item xs={12} sm={12} md={6}>
              <FormHelperText>รหัสนักศึกษา</FormHelperText>
              <TextFieldElement
                name="studentId"
                placeholder={user.studentId ?? ''}
                autoComplete="off"
                fullWidth
                size="small"
                validation={{
                  pattern: {
                    value: /^[0-9]{9}[-][0-9]$/,
                    message: 'กรุณากรอกรหัสนักศึกษาให้ถูกต้อง',
                  },
                }}
              />
            </Grid>
          )}

          {/* Bio */}
          <Grid item xs={12}>
            <FormHelperText>เกี่ยวกับฉัน</FormHelperText>
            <TextFieldElement
              name="bio"
              placeholder={user.bio ?? ''}
              autoComplete="off"
              fullWidth
              size="small"
              multiline
              rows={4}
              validation={{
                maxLength: {
                  value: 200,
                  message: 'คุณสามารถกรอกได้สูงสุด 200 ตัวอักษร',
                },
              }}
            />
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              บันทึกการเปลี่ยนแปลง
            </Button>
          </Grid>
        </Grid>
      </FormContainer>
    </section>
  ) : null;
};

export default Profile;

Profile.getLayout = (page) => {
  return <SettingsLayout title="จัดการโปรไฟล์">{page}</SettingsLayout>;
};
