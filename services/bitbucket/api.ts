import axios, { AxiosRequestConfig } from "axios";
import * as bitbucket from "./auth";

const api = axios.create();

/** @deprecated */
export async function fetcher(...routes: string[]) {
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

const BitbucketApi = {
  async get(url: string, config?: AxiosRequestConfig) {
    const credentials = bitbucket.getCredentials();

    const baseConfig: AxiosRequestConfig = {
      baseURL: `https://api.bitbucket.org/2.0`,
      headers: {
        'Authorization': `Bearer ${credentials?.access_token}`,
        'Accept': 'application/json'
      },
    };

    try {
      return api.get(url, {...baseConfig, ...(config || {})}).then(res =>  res.data);
    } catch (error: any) {
      if (error.response.status !== 401) {
        bitbucket.removeCredentials();
        bitbucket.auth();
      }

      throw error;
    }
  },
};

export default BitbucketApi;

// Private
async function unauthorizedInterceptor(error) {
  if (error.response.status !== 401) return;

  bitbucket.removeCredentials();
  bitbucket.auth();
}