import { contentHttpClient, Response } from './APIHelper';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_HOST;

interface ISignIn {
  identifier: string;
  password: string;
}

interface ISignUp {
  email: string;
  username: string;
  password: string;
}

export async function signIn({ identifier, password }: ISignIn) {
  const { res, err }: Response = await contentHttpClient.post(
    '/api/auth/local',
    {
      identifier: identifier,
      password: password,
    }
  );

  if (err) {
    console.log(`Sign in identifier=${identifier} failed with error:\n${err}`);
    if (res) {
      return { errorMsg: res.data.error.message };
    }
    return {
      errorMsg:
        'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง',
    };
  }

  return res.data;
}

export async function signUp({ email, username, password }: ISignUp) {
  const { res, err }: Response = await contentHttpClient.post(
    '/api/auth/local/register',
    {
      email: email,
      username: username,
      password: password,
    }
  );

  if (err) {
    console.log(
      `Register email=${email} username=${username} failed with error:\n${err}`
    );
    if (res) {
      return { errorMsg: res.data.error.message };
    }
    return {
      errorMsg:
        'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง',
    };
  }

  return;
}

export async function getUserInfo() {
  let { res, err }: Response = await contentHttpClient.get('/api/users/me');

  if (err) {
    console.log(`Get user data failed with error:\n${err}`);
    return;
  }

  if (res.data.profileImage !== null) {
    res.data.profileImage.url = strapiUrl + res.data.profileImage.url;
  }

  return res.data;
}
