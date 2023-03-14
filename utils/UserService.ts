import {
  ChangePassword,
  UpdateUserProfile,
  User,
  UserProfile,
} from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';
import { getImagePath } from './imagePath';
import { imageExtensions, uploadFiles } from './UploadService';

export async function getUserInfo(): Promise<User | null> {
  let { res, err }: Response = await contentHttpClient.get('/api/users/me');

  if (err) {
    // console.log(`Get user data failed with error:\n${err}`);
    throw new Error(err);
  }

  if (res.data.profileImage !== null) {
    res.data.profileImage.url = getImagePath(res.data.profileImage);
  }

  return res.data as User;
}

export const getUserProfileByUsername = async (
  username: string
): Promise<UserProfile> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/users-permissions/users/${username}/profile`
  );
  if (err) {
    throw new Error('get user profile data failed');
  }

  return res.data as UserProfile;
};

export const updateUserProfile = async (
  body: UpdateUserProfile
): Promise<void> => {
  if (body.profileImage) {
    const profileImage = await uploadFiles(
      [body.profileImage],
      imageExtensions
    );

    if (!profileImage || profileImage.length === 0) {
      throw new Error('Cannot upload files to server');
    }

    body['profileImage'] = profileImage[0];
  }

  if (body.profileImage === null) {
    body['profileImage'] = null;
  }

  if (body.profileImage === undefined) {
    delete body.profileImage;
  }

  const { err }: Response = await contentHttpClient.patch(
    `/api/users-permissions/users/profile`,
    body
  );

  if (err) {
    throw new Error('update user profile data failed');
  }
};

export const changePassword = async (body: ChangePassword): Promise<void> => {
  const { err }: Response = await contentHttpClient.post(
    `/api/auth/change-password`,
    {
      currentPassword: body.currentPassword,
      password: body.newPassword,
      passwordConfirmation: body.confirmNewPassword,
    }
  );

  if (err) {
    throw new Error('change password failed');
  }
};
