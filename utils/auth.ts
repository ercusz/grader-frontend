import axios from 'axios';

const strapiUrl = process.env.STRAPI_HOST;

interface ISignIn {
  email: string;
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
