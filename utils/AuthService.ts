import { contentHttpClient, Response } from './APIHelper';

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

export async function forgotPassword(email: string) {
  const { err }: Response = await contentHttpClient.post(
    '/api/auth/forgot-password',
    {
      email: email,
    }
  );

  if (err) {
    return {
      errorMsg:
        'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน กรุณาตรวจสอบที่อยู่อีเมลของคุณและลองใหม่อีกครั้งในภายหลัง',
    };
  }
}

export async function resetPassword(
  code: string,
  password: string,
  passwordConfirmation: string
) {
  const { err }: Response = await contentHttpClient.post(
    '/api/auth/reset-password',
    {
      code: code,
      password: password,
      passwordConfirmation: passwordConfirmation,
    }
  );

  if (err) {
    return {
      errorMsg:
        'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน กรุณาลองใหม่อีกครั้งในภายหลัง',
    };
  }
}
