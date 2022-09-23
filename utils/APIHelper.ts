import axios from 'axios';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_HOST;
const graderUrl = process.env.NEXT_PUBLIC_GRADER_HOST;

export type Response = {
  res: any;
  err: any;
};

const instances = [
  axios.create({
    baseURL: '',
  }),
  axios.create({
    baseURL: strapiUrl,
  }),
  axios.create({
    baseURL: graderUrl,
  }),
];

instances.forEach((i) =>
  i.interceptors.response.use(
    (res) => {
      return { res: res, err: null };
    },
    (error) => {
      if (error.response && typeof error.response.data === 'object') {
        return { res: error.response, err: error };
      }
      return { res: null, err: error };
    }
  )
);

export const [mainHttpClient, contentHttpClient, graderHttpClient] = instances;
