import { User, UserProfile } from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';
import { getImagePath } from './imagePath';

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
