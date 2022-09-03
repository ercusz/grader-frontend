import axios from 'axios';

const strapiUrl = process.env.STRAPI_HOST;

interface ISignIn {
  email: string;
  password: string;
}

interface ISignUp {
  email: string;
  username: string;
  password: string;
}

export async function signIn({ email, password }: ISignIn) {
  try {
    const res = await axios.post(strapiUrl + '/api/auth/local', {
      identifier: email,
      password: password,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
    } else {
      console.log('unexpected error: ', error);
    }
    return;
  }
}

export async function signUp({ email, username, password }: ISignUp) {
  const res = await axios.post('/api/auth/sign-up', {
    email: email,
    username: username,
    password: password,
  });

  return res.data;
}

export async function getUserInfo(token: string) {
  try {
    let res = await axios.get(strapiUrl + '/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data.profile_img !== null) {
      res.data.profile_img.url = strapiUrl + res.data.profile_img.url;
    }
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
    } else {
      console.log('unexpected error: ', error);
    }
    return;
  }
}
