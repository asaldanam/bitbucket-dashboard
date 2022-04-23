import axios, { AxiosRequestConfig } from "axios";
import * as bitbucket from "./bitbucket.auth";

const api = axios.create();

export type BitbucketApiParams = {
  ep: string,
  version?: string;
} & AxiosRequestConfig;

export default async function bitbucketApi(params: BitbucketApiParams) {
  const credentials = bitbucket.getCredentials();

  const config: AxiosRequestConfig = {
    baseURL: `https://api.bitbucket.org${params.version || '/2.0'}`,
    headers: {
      'Authorization': `Bearer ${credentials?.access_token}`,
      'Accept': 'application/json'
    },
    ...params,
  };

  try {
    const { data } = await api.get(params.ep, config);
    return data;
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