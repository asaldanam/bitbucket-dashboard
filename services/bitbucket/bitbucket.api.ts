import axios, { AxiosRequestConfig } from "axios";
import * as bitbucket from "./bitbucket.auth";

const api = axios.create();

export default async function bitbucketApi(...routes: string[]) {
  console.log({routes})
  const credentials = bitbucket.getCredentials();

  const config: AxiosRequestConfig = {
    baseURL: `https://api.bitbucket.org/2.0`,
    headers: {
      'Authorization': `Bearer ${credentials?.access_token}`,
      'Accept': 'application/json'
    },
  };

  try {
    const requests = routes.map(route => api.get(route, config).then(res => res.data))
    const data = await Promise.all(requests);
    return data.length > 1 ? data : data[0];
  } catch (error) {
    await unauthorizedInterceptor(error);
    throw error;
  }
}

// Private

async function unauthorizedInterceptor(error) {
  if (error.response.status !== 401) return;

  bitbucket.removeCredentials();
  bitbucket.auth();
}