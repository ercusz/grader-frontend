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
    console.log(error);
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